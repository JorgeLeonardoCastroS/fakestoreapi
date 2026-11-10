import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// 1. Carga y parametrización local del CSV (sin llamadas externas)
const usersData = new SharedArray('users_credentials', function () {
    const csvString = open('../data/users.csv');
    const lines = csvString.trim().split('\n');
    const users = [];

    // Omitimos la primera línea (cabecera: user,passwd) y recorremos el resto
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            if (parts.length >= 2) {
                users.push({
                    user: parts[0].trim(),
                    passwd: parts[1].trim(),
                });
            }
        }
    }
    return users;
});

// 2. Configuración del escenario de pruebas y criterios de aceptación (Thresholds)
export const options = {
    stages: [
        { duration: '15s', target: 10 }, // Ramp-up inicial
        { duration: '45s', target: 25 }, // Carga constante sostenida (alcanza > 20 TPS)
        { duration: '15s', target: 0 },  // Ramp-down
    ],
    thresholds: {
        // El 95% de las peticiones debe responder en menos de 1.5s (1500 ms)
        http_req_duration: ['p(95)<1500'],
        // Tasa de errores HTTP debe ser estrictamente menor al 3%
        http_req_failed: ['rate<0.03'],
    },
};

export default function () {
    const url = 'https://fakestoreapi.com/auth/login';

    // Selección aleatoria de un usuario del CSV por cada iteración
    const randomUser = usersData[Math.floor(Math.random() * usersData.length)];

    const payload = JSON.stringify({
        username: randomUser.user,
        password: randomUser.passwd,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '60s',
    };

    const res = http.post(url, payload, params);

    // Validaciones funcionales de respuesta (Checks)
    check(res, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has auth token': (r) => r.json() && r.json().token !== undefined,
        'response time < 1.5s': (r) => r.timings.duration < 1500,
    });

    // Pacing entre iteraciones
    sleep(1);
}