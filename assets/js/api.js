const config = {
    base_url: 'https://api.football-data.org/v2/',
    token: '3ae833ff41de47e19ee0754116329a6b',
    league_id: '2015',
    get endpoint() {
        return {
            base_url: this.base_url,
            klasemen: `${this.base_url}competitions/${this.league_id}/standings/`,
            teams: `${this.base_url}teams/`,
            upComing: `${this.base_url}competitions/${this.league_id}/matches?status=SCHEDULED`,
            matchDetail: `${this.base_url}matches`,

        }
    }
}

const {
    token,
    endpoint
} = config;

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response) => {
    if (response.status !== 200) {
        console.log(`Error : ${response.status}`);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// blok kode untuk parsing json menjadi array js
const json = (response) => {
    return response.json();
}

// kode untuk menghandle kesalahan di blok catch
const error = (error) => {
    // param error dari Promise.reject()
    console.log(`Error : ${error}`);
}

// kode untuk request data json
const displayKlasemen = () => {
    if ('caches' in window) {
        caches.match(endpoint.klasemen)
            .then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        var rowTable = "";

                        data.standings[0].table.forEach(dTeam => {
                            rowTable += `
                        <tr>
                            <td>${dTeam.position}</td>
                            <td>
                                <a href="team.html?id=${dTeam.team.id}" class="link-to-team valign-wrapper"><img
                                src="${dTeam.team.crestUrl.replace(/^http:\/\//i, 'https://')}"
                                class="responsive-img cres" alt=""> ${dTeam.team.name}</a>
                            </td>
                            <td>${dTeam.playedGames}</td>
                            <td>${dTeam.won}</td>
                            <td>${dTeam.draw}</td>
                            <td>${dTeam.lost}</td>
                            <td>${dTeam.goalsFor}</td>
                            <td>${dTeam.goalsAgainst}</td>
                            <td>${dTeam.goalDifference}</td>
                            <td>${dTeam.points}</td>
                        </tr>
                            `
                        });
                        document.getElementById("body-content").innerHTML = rowTable;
                    })
                }
            })
    }

    fetch(endpoint.klasemen, {
        method: "GET",
        headers: {
            'X-Auth-Token': token
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            var rowTable = "";

            data.standings[0].table.forEach(dTeam => {
                rowTable += `
                        <tr>
                            <td>${dTeam.position}</td>
                            <td>
                                <a href="team.html?id=${dTeam.team.id}" class="link-to-team valign-wrapper"><img
                                src="${dTeam.team.crestUrl.replace(/^http:\/\//i, 'https://')}"
                                class="responsive-img cres" alt=""> ${dTeam.team.name}</a>
                            </td>
                            <td>${dTeam.playedGames}</td>
                            <td>${dTeam.won}</td>
                            <td>${dTeam.draw}</td>
                            <td>${dTeam.lost}</td>
                            <td>${dTeam.goalsFor}</td>
                            <td>${dTeam.goalsAgainst}</td>
                            <td>${dTeam.goalDifference}</td>
                            <td>${dTeam.points}</td>
                        </tr>
                            `
            });
            document.getElementById("body-content").innerHTML = rowTable;
        })
}

const displayTeam = () => {
    return new Promise(function (resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idParam = urlParams.get("id");
        if ('caches' in window) {
            caches.match(endpoint.teams + idParam)
                .then(function (response) {
                    if (response) {
                        response.json().then(function (data) {
                            let team_logo = `<img src="${data.crestUrl}" alt="" class="responsive-img team-logo">`
                            squadLeft = '';
                            squadRight = '';

                            // squad
                            data.squad.forEach((v, i) => {
                                if (i < (data.squad.length / 2)) {
                                    squadLeft += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                                }
                                else {
                                    squadRight += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                                }
                            })

                            document.getElementById('image-team').innerHTML = team_logo;
                            document.getElementById('team-name').innerHTML = `<h1>${data.name}</h1>`;
                            document.querySelector('#information').innerHTML = `
                    <li class="collection-item">address : ${data.address}</li>
                    <li class="collection-item">phone : ${data.phone}</li>
                    <li class="collection-item">website : <a href="${data.website}" target="_blank">${data.website}</a></li>
                    <li class="collection-item">email : ${data.email}</li>
                    <li class="collection-item">founded : ${data.founded}</li>
                    <li class="collection-item">club colors : ${data.clubColors}</li>
                    <li class="collection-item">venue : ${data.vanue}</li>
                `
                            document.getElementById('squadLeft').innerHTML = squadLeft
                            document.getElementById('squadRight').innerHTML = squadRight

                            resolve(data);
                        })
                    }
                })
        }

        fetch(endpoint.teams + idParam, {
            method: "GET",
            headers: {
                'X-Auth-Token': token
            }
        }).then(status)
            .then(json)
            .then(function (data) {
                let team_logo = `<img src="${data.crestUrl}" alt="" class="responsive-img team-logo">`
                squadLeft = '';
                squadRight = '';

                // squad
                data.squad.forEach((v, i) => {
                    if (i < (data.squad.length / 2)) {
                        squadLeft += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                    }
                    else {
                        squadRight += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                    }
                })

                document.getElementById('image-team').innerHTML = team_logo;
                document.getElementById('team-name').innerHTML = `<h1>${data.name}</h1>`;
                document.querySelector('#information').innerHTML = `
                    <li class="collection-item">address : ${data.address}</li>
                    <li class="collection-item">phone : ${data.phone}</li>
                    <li class="collection-item">website : <a href="${data.website}" target="_blank">${data.website}</a></li>
                    <li class="collection-item">email : ${data.email}</li>
                    <li class="collection-item">founded : ${data.founded}</li>
                    <li class="collection-item">club colors : ${data.clubColors}</li>
                    <li class="collection-item">venue : ${data.vanue}</li>
                `
                document.getElementById('squadLeft').innerHTML = squadLeft
                document.getElementById('squadRight').innerHTML = squadRight

                resolve(data);
            })
    })
}


const displayMatch = () => {
    if ('caches' in window) {
        caches.match(endpoint.upComing)
            .then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let matches = "";

                        data.matches.forEach(match => {
                            matches += `
                                <div class="col s12 m6 l6">
                                    <div class="card horizontal d-flex f-width-100 align-item-center">
                                        <div class="card-content">
                                            <div class="row">
                                                <div class="col s12 m12 l12 justify-center">
                                                    <p class="text-darken-3">${new Date(match.utcDate).toLocaleDateString('en-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                                    </p>                                
                                                </div>
                                            </div>
                                            <div class="row mb-0">
                                                <div class="col s5 m5 l5">
                                                    <h6>home</h6> 
                                                    <a id="home-team-link" href="team.html?id=${match.homeTeam.id}">${match.homeTeam.name}</a> 
                                                </div>
                                                <div class="col s2 m2 l2">
                                                    <h5>VS</h5>
                                                </div>
                                                <div class="col s5 m5 l5">
                                                    <h6>away</h6> 
                                                    <a id="away-team-link" href="team.html?id=${match.awayTeam.id}">${match.awayTeam.name}</a>   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        })

                        document.getElementById("match").innerHTML = matches;
                    })
                }
            })
    }
    fetch(endpoint.upComing, {
        method: "GET",
        headers: {
            'X-Auth-Token': token
        }
    }).then(status)
        .then(json)
        .then(function (data) {
            let matches = "";

            data.matches.forEach(match => {
                matches += `
                    <div class="col s12 m6 l6">
                        <div class="card horizontal d-flex f-width-100 align-item-center">
                            <div class="card-content">
                                <div class="row">
                                    <div class="col s12 m12 l12 justify-center">
                                        <p class="text-darken-3">${new Date(match.utcDate).toLocaleDateString('en-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                                        </p>                                
                                    </div>
                                </div>
                                <div class="row mb-0">
                                    <div class="col s5 m5 l5">
                                        <h6>home</h6> 
                                        <a id="home-team-link" href="team.html?id=${match.homeTeam.id}">${match.homeTeam.name}</a> 
                                    </div>
                                    <div class="col s2 m2 l2">
                                        <h5>VS</h5>
                                    </div>
                                    <div class="col s5 m5 l5">
                                        <h6>away</h6> 
                                        <a id="away-team-link" href="team.html?id=${match.awayTeam.id}">${match.awayTeam.name}</a>   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            })

            document.getElementById("match").innerHTML = matches;
        })
}

const displaySavedTeams = () => {
    getAllTeamFav().then((data) => {
        console.log(data)
        let dataTeams = "";
        data.forEach(team => {
            dataTeams += `
            <div class="col s12 m6 l6">
            <div class="card horizontal d-flex f-width-100 align-item-center">
              <div class="card-image responsive-img">
                <img src="${team.crestUrl}">
              </div>
              <div class="card-stacked">
                <div class="card-content">
                  <h4>${team.name}</h4>
                </div>
                <div class="card-action">
                  <a href="team.html?id=${team.id}&saved=true">Lihat Detail</a>
                </div>
              </div>
            </div>
          </div>
            `
        })

        document.getElementById('fav-team').innerHTML = dataTeams;
    })
}

const getSavedTeamById = () => {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    console.log(idParam)
    getTeamFavById(Number(idParam))
        .then((data) => {
            console.log(data);

            let team_logo = `<img src="${data.crestUrl}" alt="" class="responsive-img team-logo">`
            squadLeft = '';
            squadRight = '';

            // squad
            data.squad.forEach((v, i) => {
                if (i < (data.squad.length / 2)) {
                    squadLeft += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                }
                else {
                    squadRight += `
                        <li>
                            <div class="collapsible-header">${v.name}</div>
                            <div class="collapsible-body p-0">
                                <ul class="collection">
                                    <li class="collection-item">position : ${v.position}</li>
                                    <li class="collection-item">date of birth : ${v.dateOfBirth}</li>
                                    <li class="collection-item">country of birth : ${v.countryOfBirth}</li>
                                    <li class="collection-item">nationality : ${v.nationality}</li>
                                    <li class="collection-item">shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                                    <li class="collection-item">role : ${(v.role).toLowerCase()}</li>
                                </ul>
                            </div>
                        </li>
                        `
                }
            })

            document.getElementById('image-team').innerHTML = team_logo;
            document.getElementById('team-name').innerHTML = `<h1>${data.name}</h1>`;
            document.querySelector('#information').innerHTML = `
                    <li class="collection-item">address : ${data.address}</li>
                    <li class="collection-item">phone : ${data.phone}</li>
                    <li class="collection-item">website : <a href="${data.website}" target="_blank">${data.website}</a></li>
                    <li class="collection-item">email : ${data.email}</li>
                    <li class="collection-item">founded : ${data.founded}</li>
                    <li class="collection-item">club colors : ${data.clubColors}</li>
                    <li class="collection-item">venue : ${data.vanue}</li>
                `
            document.getElementById('squadLeft').innerHTML = squadLeft
            document.getElementById('squadRight').innerHTML = squadRight

        })
}