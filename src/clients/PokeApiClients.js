import axios from 'axios';

const consumirAPI = async (idPokemon) => {
    const respuesta = axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`).then(res => res.data);
    console.log(respuesta);
    return respuesta;
}

export async function consumirAPIFacade(idPokemon) {
    return await consumirAPI(idPokemon);
}