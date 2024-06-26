const apikey = "442c5697d2b40503acedc3d3f4b29732";

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                    weatherReport(data);
                });
        });
    }
});

function searchByCity() {
    var place = document.getElementById('input').value;
    var urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

    fetch(urlsearch)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Location not found. Please enter a valid location.');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            weatherReport(data);
        })
        .catch((error) => {
            alert(error.message);
        });

    document.getElementById('input').value = '';
}

function weatherReport(data) {
    var urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;
    fetch(urlcast)
        .then((res) => {
            return res.json();
        })
        .then((forecast) => {
            hourForecast(forecast);
            dayForecast(forecast);
            document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
            document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + ' °C';
            document.getElementById('clouds').innerText = data.weather[0].description;
            let icon1 = data.weather[0].icon;
            let iconurl = "https://api.openweathermap.org/img/w/" + icon1 + ".png";
            document.getElementById('img').src = iconurl;
        });
}

function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);
        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');
        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = date.toLocaleTimeString(undefined, 'Asia/Kolkata').replace(':00', '');
        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
        div.appendChild(time);
        div.appendChild(temp);
        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;
        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = '';
    for (let i = 8; i < forecast.list.length; i += 8) {
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');
        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);
        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C';
        div.appendChild(temp);
        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);
        document.querySelector('.weekF').appendChild(div);
    }
}

function changeTheme(theme) {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
}

function adjustFontSize(size) {
    let fontSize;

    switch (size) {
        case 'small':
            fontSize = '12px';
            break;
        case 'extra-small':
            fontSize = '10px';
            break;
        case 'large':
            fontSize = '20px';
            break;
        case 'extra-large':
            fontSize = '30px';
            break;
        default:
            fontSize = '16px';
    }

    document.body.style.fontSize = fontSize;
}

function EnterKey(event) {
    if (event.keyCode === 13) {
        searchByCity();
    }
}

document.getElementById('input').addEventListener('keydown', EnterKey);

document.getElementById('searchButton').addEventListener('click', searchByCity);