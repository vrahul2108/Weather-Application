const apikey="56c570ef7cee94fd8ab2b239d5f3f34c";
window.addEventListener("load",()=>{ 
    //This line sets up an event listener that waits for the entire window (including all assets like images, scripts, etc.) to load. Once the window is fully loaded, the callback function inside the event listener is executed.
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
             //This checks if the browser supports geolocation (navigator.geolocation). If it does, it uses getCurrentPosition to get the current geographical position of the user. The position is passed to the callback function as an argument.
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            //This constructs the URL for the OpenWeatherMap API, including the user's latitude and longitude, and appends the API key.

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{ //This part uses the fetch API to make a request to the constructed URL. It then handles the response by converting it to JSON format with res.json(). The parsed JSON data is passed to the next then block
                
                console.log(data);
                //This logs the entire weather data object to the console.
                console.log(new Date().getTime());
                //This logs the current time in milliseconds since the Unix Epoch (January 1, 1970).
                var dat= new Date(data.dt);
                console.log(dat.toLocaleString(undefined,'Asia/Kolkata'));
                //This creates a new Date object using the dt property from the weather data. The dt property represents the time of data calculation in Unix time. It then logs this date as a localized string using the time zone 'Asia/Kolkata'.
                console.log(new Date().getMinutes());
                //This logs the current minutes part of the current time.
                weatherReport(data);
            })
        })
    }
})


function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}


function weatherReport(data){
//weatherReport, is designed to display current weather information and fetch a weather forecast for a given location.

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;
//This line constructs a URL (urlcast) for the weather forecast based on the city name (data.name) from the data parameter and the API key (apikey).

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{

        // the fetch API is used to request the forecast data from the constructed URL. The response (res) is converted to JSON format and passed to the next then block as forecast.

        console.log(forecast.city);// Logs the forecast city's information to the console.
        hourForecast(forecast);
        dayForecast(forecast);

        console.log(data);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;//Updates the inner text of the element with ID city to display the city name and country.
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';//Updates the inner text of the element with ID temperature to display the current temperature in Celsius.
    
        document.getElementById('clouds').innerText= data.weather[0].description;// Updates the inner text of the element with ID clouds to display the weather description.
        console.log(data.weather[0].description);
        
        let icon1= data.weather[0].icon;
        console.log(icon1)
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl;//Updates the src attribute of the element with ID img to display the weather icon
    })

}

//hourForecast function displays the weather forecast for the next five hours.
function hourForecast(forecast){
    document.querySelector('.templist').innerHTML='';
    //This line clears any existing content in the element with the class templist.
    for (let i = 0; i < 5; i++) {
        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))
        //The loop iterates through the first five entries in the forecast.list array.    forecast.list[i].dt is a Unix timestamp in seconds, which is converted to milliseconds and used to create a Date object. The toLocaleTimeString method formats the time according to the 'Asia/Kolkata' time zone and removes the seconds from the string.


        let hourR=document.createElement('div'); //Creates a new div element and assigns it to the variable hourR
        hourR.setAttribute('class','next');//Sets the class attribute of the hourR element to 'next' for styling

        let div= document.createElement('div');//Creates another div element and assigns it to the variable div. This will be used to group the time and temperature information together.
        let time= document.createElement('p');///Creates a new p (paragraph) element for displaying the time.
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');
//Converts the date object to a localized time string in the 'Asia/Kolkata' time zone.
// Removes the :00 seconds part from the time string, leaving only the hours and minutes.

        let temp= document.createElement('p');//Creates a new p (paragraph) element for displaying the temperature.
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)//Appends the time paragraph element to the div element.
        div.appendChild(temp)//Appends the temp paragraph element to the div element.

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);//Appends the div element (which contains the time and temperature) to the hourR element.
        hourR.appendChild(desc)//Appends the desc paragraph element (which contains the weather description) to the hourR element.

        document.querySelector('.templist').appendChild(hourR);///Selects the element with the class templist and appends the hourR element (containing all the forecast information for one hour) to it.
}
}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML='';
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let description= document.createElement('p');
        description.setAttribute('class','desc');
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    }
} 