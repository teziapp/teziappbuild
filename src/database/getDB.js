import dbFunc from './dbFunc';
import { COUCH_DB_USERS,  COUCH_DB_MASTERS } from '../constants';

function getDatabase(input){
  console.log(input);
    localStorage.setItem('ownerid', '000000001'); //this needs to be revised on login.
    if(input==="user"){
        let db = dbFunc(COUCH_DB_USERS)
        console.log(db)
        localStorage.setItem('ownerid', '000000001') //this needs to be revised on login.
        db = db.getUser(localStorage.getItem('name'), function (err, response) {
            if (err) {
              if (err.name === 'not_found') {
                console.log("User Not Found")
            } else {
                console.log(err);
              }
            } else {
                console.log(response);
                return response;
            }
          })
        console.log(db);        
        db = db.then((db) => {
                    console.log(db);
                    return db;    
                })
                .catch(err => console.error(err));
            console.log(db);
        // return db;
    } else {
      let db = dbFunc(input);
      console.log(db)
      return db;
    }
}

export default getDatabase