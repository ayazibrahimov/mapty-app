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
    constructor(coords,distance,duration,cadance){
        super(coords,distance,duration);
        this.cadance = cadance
    }

    //min/km

    calcPace(){
      this.pace = this.duration / this.distance
      return this.pace
    }

}


class Cycling extends Workout {
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain = elevationGain
    }

    calcSpeed(){
        this.speed = this.distance / (this.duration * 60)
        return this.speed
    }

}


const run = new Running([18,-16],60,12,2) 
const cycle = new Cycling([15,-5],40,5,1) 

console.log(run);
console.log(cycle);





class App{
    
    #map;
    #mapEvent;

    constructor(){
        this._getPosition()

        form.addEventListener('submit',this._newWork.bind(this))
        inputType.addEventListener('change',this._toggleElevationField())
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
        e.preventDefault()
        
        
        inputElevation.value = inputCadence.value = inputDuration.value = inputDistance.value = ''
    
        //display marker
    
        const {lat,lng} = this.#mapEvent.latlng
                    
        L.marker([lat,lng])
        .addTo(this.#map)
        .bindPopup(
            L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:'running-popup'
        }))
        .setPopupContent('Salam ay qaqa')
        .openPopup();
    }

}


const app = new App()






////