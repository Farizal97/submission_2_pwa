var dbPromised = idb.open("football-data", 3, function (upgradeDb) {
    var teamStore = upgradeDb.createObjectStore("teamFavorite", {
        keyPath: "id"
    });

    teamStore.createIndex("name", "name", { unique: false });
})

function addTeamFav(team) {

    dbPromised
        .then(function (db) {
            var tx = db.transaction("teamFavorite", "readwrite");
            var store = tx.objectStore("teamFavorite");
            store.add(team);
            return tx.complete;
        })
        .then(function () {
            alert(`berhasil menambahkan ke ${team.name} ke favorite`)
        })
        .catch(function () {
            alert('data sudah ada. tidak dapat menyimpan data yang sama')
        })
}

// read
function getAllTeamFav() {
    return new Promise((resolve, reject) => {
        dbPromised
            .then(db => {
                var tx = db.transaction("teamFavorite", "readonly");
                var store = tx.objectStore("teamFavorite");
                return store.getAll();
            })
            .then(function (teamFavorite) {
                resolve(teamFavorite);
            })
    })
}

function getTeamFavById(idTeam) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teamFavorite", "readonly");
                var store = tx.objectStore("teamFavorite");
                return store.get(idTeam);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function deleteTeamFav(id) {
    dbPromised
        .then(db => {
            let tx = db.transaction('teamFavorite', 'readwrite')
            tx.objectStore('teamFavorite').delete(id)
            return tx.complete
        })
        .then(function () {
            alert("Berhasil menghapus data dari favorite")
        })
}