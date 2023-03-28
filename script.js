'use strict';



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


    _getDateInfo(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       this.dataInfo = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.
        getMonth()]} ${this.date.getDate()}
       `
    }

}

class Running extends Workout {
     
    type = 'running'

    constructor(coords,distance,duration,cadance){
        super(coords,distance,duration);
        this.cadance = cadance;
        this._getDateInfo();
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
        this.elevationGain = elevationGain;
        this._getDateInfo();
    }

    calcSpeed(){
        this.speed = this.distance / (this.duration * 60)
        return this.speed
    }
}


class App{
    
    #map;
    #mapEvent;
    #dataZoom=14;
    #workouts=[]

    constructor(){
        this._getPosition()
        form.addEventListener('submit',this._newWork.bind(this))
        inputType.addEventListener('change',this._toggleElevationField.bind(this))
        containerWorkouts.addEventListener('click',this._movePositionData.bind(this))
    }

    _getPosition() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
            this._loadMap.bind(this),function(){
                alert("Don't Catch API")
            })
        }
    }

    _loadMap(position) {
            const {latitude} = position.coords
            const {longitude} = position.coords
    
            const coords = [latitude,longitude]
    
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    
             this.#map = L.map('map').setView(coords, this.#dataZoom);
    
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

    _hideForm(){
        inputElevation.value = inputCadence.value = inputDuration.value = inputDistance.value = ''
        form.style.display = 'none'
        form.classList.add('hidden')
        setTimeout(()=>form.style.display = 'grid',1000)
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

        this._renderWorkOut(workout)

        //hide form

        this._hideForm()
       

    }



    _renderWorkOut(workout){


        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.dataInfo}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        `

        if(workout.type === 'running'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.calcPace().toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadance}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
            
            `
        }

        if(workout.type === 'cycling'){
            html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.calcSpeed().toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">spm</span>
          </div>
         </li> 
        `
        }

        form.insertAdjacentHTML('afterend',html)


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
        .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}${workout.dataInfo}`)
        .openPopup();
    }


    _movePositionData(e){
        const workoutEl = e.target.closest('.workout')


        if(!workoutEl) return;
     

        const workout = this.#workouts.find(work=>work.id === workoutEl.dataset.id)

        this.#map.setView(workout.coords,this.#dataZoom,{
            animate:true,
            pan:{
                duration:1
            }
        })
    }
    

}


const app = new App()




////