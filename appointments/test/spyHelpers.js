// Mocks dos fetchs OK e Error e método para retornar o body de uma resposta

export const fetchResponseOk = body =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body)
    });

export const fetchResponseError = () =>
    Promise.resolve({ ok: false });

export const requestBodyOf = fetchSpy =>
    JSON.parse(fetchSpy.mock.calls[0][1].body);