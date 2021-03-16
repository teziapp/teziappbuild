import { COUCH_URL } from "../constants";


const fetchInit = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default',
};
const fetchRequest = new Request(`${COUCH_URL}/_up`, fetchInit);

export default fetchRequest;