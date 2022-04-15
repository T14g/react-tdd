// Mocks dos fetchs OK e Error e método para retornar o body de uma resposta

export const fetchResponseOk = body =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body)
    });

// retorna uma promise com status 500 e com corpo de um objeto vazio por padrão
export const fetchResponseError = (status = 500, body = {}) =>
    Promise.resolve({
        ok: false,
        status,
        json: () => Promise.resolve(body)
    });

// retorna o corpo de uma chamada mockada
export const requestBodyOf = fetchSpy =>
    JSON.parse(fetchSpy.mock.calls[0][1].body);