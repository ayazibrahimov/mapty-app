'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// let map, mapEvent;
// let mapEvent;

class Workout {
     
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords,distance,duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;   
    }

}

class Running extends Workout {
     
    type = 'running'

    constructor(coords,distance,duration,cadance){
        super(coords,distance,duration);
        // this.type = 'running'
        this.cadance = cadance
    }

    //min/km

    calcPace(){
      this.pace = this.duration / this.distance
      return this.pace
    }
}


class Cycling extends Workout {
    
    type = 'cycling'

    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain = elevationGain
    }

    calcSpeed(){
        this.speed = this.distance / (this.duration * 60)
        return this.speed
    }
}


class App{
    
    #map;
    #mapEvent;
    #workouts=[]

    constructor(){
        this._getPosition()

        form.addEventListener('submit',this._newWork.bind(this))
        inputType.addEventListener('change',this._toggleElevationField.bind(this))
    }

    _getPosition() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
            this._loadMap.bind(this),function(){
                alert('salala')
            })
        }
    }

    _loadMap(position) {
            const {latitude} = position.coords
            const {longitude} = position.coords
    
            const coords = [latitude,longitude]
    
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    
             this.#map = L.map('map').setView(coords, 14);
    
              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(this.#map);

                  L.marker(coords).addTo(this.#map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();
    
                  this.#map.on('click',this._showForm.bind(this))

            
    }


    _showForm(mapE) {
                
            this.#mapEvent = mapE
   
            form.classList.remove('hidden')
            inputDistance.focus() 
   
          
    }

    _toggleElevationField() {
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWork(e){
        
        const filterNums = (...datas) => datas.every(data=>Number.isFinite(data))
        const filterPositive = (...datas)=>datas.every(data=>data > 0)
        
        e.preventDefault()
        
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat,lng} = this.#mapEvent.latlng
        let workout;


        if(type === "running"){
          
          const cadence = +inputCadence.value
          

          if(!filterNums(distance,duration,cadence) || !filterPositive(distance,duration,cadence)){
               return alert('Ancaq nomre')
          }

           workout = new Running([lat,lng],distance,duration,cadence)
           
           this.#workouts.push(workout)
        }


        if(type === "cycling"){

            const elevation = +inputElevation.value
          

            if(!filterNums(distance,duration,elevation) || !filterPositive(distance,duration,elevation)){
                 return alert('Ancaq nomre')
            }

            workout = new Cycling([lat,lng],distance,duration,elevation)
           
            this.#workouts.push(workout)
        }


        console.log(this.#workouts);
    
        //display marker
    
        // const {lat,lng} = this.#mapEvent.latlng
    
        this._renderWorkOutMarker(workout)

        //render workout
       

        inputElevation.value = inputCadence.value = inputDuration.value = inputDistance.value = ''
    }


    _renderWorkOutMarker(workout){
        L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(
            L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:`${workout.type}-popup`
        }))
        .setPopupContent('Salam ay qaqa')
        .openPopup();
    }

}


const app = new App()




////