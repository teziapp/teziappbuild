import PouchDB from 'pouchdb-browser'
import { COUCH_URL, COUCH_DB_CLIENTS, COUCH_USER, COUCH_PASSWORD, COUCH_DB_ORDERS, COUCH_DB_PROD, COUCH_DB_GROUP, COUCH_DB_MASTERS, COUCH_DB_USERS } from "../constants";

import PouchDBfind from 'pouchdb-find'
import plugin from 'pouchdb-authentication';
PouchDB.plugin(plugin);
PouchDB.plugin(PouchDBfind);

const createDatabase = function (name){
    const db = new PouchDB(name);

    const remoteDatabase = new PouchDB(`${COUCH_URL}/${name}`, {
        skip_setup: true
    });

    // console.log('db remotedatabase', remoteDatabase);

    remoteDatabase.login(localStorage.getItem('name'), localStorage.getItem('password'))
        .then(function () {
            PouchDB.sync(db, remoteDatabase, {
                live: true,
                heartbeat: false,
                timeout: false,
                retry: true
            });
        }).catch(function (error) {
            console.error(error);
        });

    return db;
}

export default function getDatabase(id) {
    console.log(id);
    switch (id) {
        case COUCH_DB_MASTERS:
            const mastersDB = createDatabase(COUCH_DB_MASTERS+"_"+localStorage.getItem('ownerid'));
        return mastersDB;
        case COUCH_DB_ORDERS:
            const ordersDB = createDatabase(COUCH_DB_ORDERS+"_"+localStorage.getItem('ownerid'));
            console.log(ordersDB);
        return ordersDB;
        case COUCH_DB_USERS:
            const usersDB = createDatabase(COUCH_DB_USERS);
        return usersDB;
    }
}