const BASE_URL = 'https://pokeapi.co/api/v2';

const request = async (endpoint, method = 'GET', body = null, isAuthRequest = false,) => {
    // Définir les en-têtes
    const headers = {
        'Content-Type': 'application/json',
    };
    // Configurer la requête
    const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    };
    
    try {
        // Envoyer la requête
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Gérer la réponse
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Something went wrong');
        }

        // Vérifier si la réponse a du contenu
        const contentType = response.headers.get('content-type');
        return contentType && contentType.includes('application/json') ? await response.json() : null;

    } catch (error) {
        // Gestion des erreurs
        console.error('API Error:', error);
        throw error;
    }
};

const getPokemons = (limit) => {
    return request(`/pokemon?limit=${limit}`, 'GET');
}

const getPokemonByName = (pokemonName) => {
    return request(`/pokemon/${pokemonName}`, 'GET');
};

export {getPokemons, getPokemonById, getPokemonByName};