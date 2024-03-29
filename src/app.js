import { format, differenceInDays } from "date-fns";
import { da, ru } from "date-fns/locale"

let currentReservationTourId
// const tours = init()
// console.log(tours)

async function init() {
	const responce = await fetch(
		"https://www.bit-by-bit.ru/api/student-projects/tours"
	)
	tours = await responce.json()
    // console.log(arr)

    // return 
    renderTours(tours)

    document.getElementById("thailand").addEventListener('click',() => {
        filterByCountry(tours, "Тайланд")
    })
    document.getElementById("maldives").addEventListener('click',() => {
        filterByCountry(tours, "Мальдивы")
    })
    document.getElementById("indonezia").addEventListener('click',() => {
        filterByCountry(tours, "Индонезия")
    })
    document.getElementById("all").addEventListener('click',() => {
        filterByCountry(tours)
    })
    document.getElementById("all-tours-button").addEventListener('click', () => {renderTours(tours)
    })
}

async function renderTours(tours) {

    const container = document.getElementById("container-tours")
    container.innerHTML = ''
    const favoriteTours = getFavoriteTours()

    tours.forEach((tour) => {
        const duration = differenceInDays(
            new Date(tour.endTime),
            new Date(tour.startTime)
        )

        const city = tour.city
        const isFavorite = favoriteTours.includes(tour.id)
		// console.log(favoriteTours, isFavorite)

        container.innerHTML += `
        <div class="tour" id="container-basic-${tour.id}">
                        <div class="w-full h-72 relative">
                           <img class="tour-image" src="${tour.image}" />

                           <div class="absolute inset-0 bg-black/50 z-10" id="container-upper-${tour.id}"></div>
 
                           <div class="flex justify-between pt-1 absolute bg-teal-900/50 top-0 right-0 left-0 z-20 ">
                             <p class="tour-hotel">${tour.hotelName}</p>
                             <div class="flex gap-2 mr-5 text-xl items-center text-emerald-300">
                               <i class="fa-solid fa-star"></i>
                               <p class="tour-hotel-rating">${tour.rating}</p>
                             </div>
                           </div>

                           <div class="country">
                               <h2 class="tour-title">${tour.country}.</h2>
                               <h4 class="tour-city" id="city_of_tour-${tour.id}">${
                                   tour.city
                               }</h4>
                           </div>

                        </div>
                        <p class="tour-date"> ${format(
                            new Date(tour.startTime),
                            "dd MMMM",
                            { locale: ru }
                        )} - ${format(new Date(tour.endTime), "dd MMMM   ", {
                            locale: ru
                        })}  ${duration} дней</p>
                        
                        <div class="flex justify-between ml-5 mr-5 items-center">
                           <div class="flex items-center mb-5 text-slate-500">
                             <i class="fa-solid fa-ruble-sign"></i>
                             <p class="tour-price">${tour.price}</p>
                           </div>
                        
                           <div class="flex justify-end">
                               <button class="tour-button w-full" id="modalReservation_open-button--${tour.id}">Забронировать</button>
                               <button class="tour-button w-10" id="add_to_Favorites-button--${tour.id}">
                               ${isFavorite ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
                               </button>
                               
                           </div>
                        </div>  
                        `

        if (city == null) {
            const tourCity = document.getElementById(`city_of_tour-${tour.id}`)
            tourCity.style.display = "none"
        }
    })

    tours.forEach((tour) => {
        const basicContainer = document.getElementById(`container-basic-${tour.id}`)
        const makeRemoveUpperContainer = () => removeUpperContainer(tour)
        basicContainer.addEventListener("mouseover", makeRemoveUpperContainer)

        const upperContainer = document.getElementById(`container-upper-${tour.id}`)
        const makeReturnUpperContainer = () => returnUpperContainer(tour)
        basicContainer.addEventListener("mouseout", makeReturnUpperContainer)

        const buttonOpenModalReservation = document.getElementById(`modalReservation_open-button--${tour.id}`)
        buttonOpenModalReservation.addEventListener("click", () => {
            currentReservationTourId = tour.id
            openModalReservation()
        })

        const buttonAddToFavorites = document.getElementById(`add_to_Favorites-button--${tour.id}`)
        buttonAddToFavorites.addEventListener("click", () => {
            addToFavorites(tour.id, tours)
        })
    })
}

async function openModalReservation() {
    const responce = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const tours = await responce.json()

    // const tours = init()

    const modalReservation = document.getElementById("modal-reservation")
    modalReservation.style.display = "flex"

    const tour = tours.find((t) => {
        return t.id === currentReservationTourId
    })

    const duration = differenceInDays(
      new Date(tour.endTime),
      new Date(tour.startTime)
    )
    
    const containerReservationTour = document.getElementById("reservaition_container")
    containerReservationTour.innerHTML += `
    <div class="w-full h-1/6 relative">
        <img class="tour-image" src="${tour.image}"/>

        <div class="flex justify-between pt-1 absolute bg-teal-900/50 top-0 right-0 left-0 z-20">
            <p class="tour-hotel-reservaition">${tour.hotelName}</p>
            <div class="flex gap-2 mr-5 text-3xl items-center text-emerald-300">
                <i class="fa-solid fa-star"></i>
                <p class="tour-hotel-rating">${tour.rating}</p>
            </div>
        </div>

        <div class="grid grid-cols-1">
            <div class="country bg-slate-300/90 px-3">
                <h2 class="tour-title-reservaition">${tour.country}.</h2>
                <h4 class="tour-city-reservaition" id="reservaition_city">${tour.city}.</h4>
            </div>
            
            <div class="absolute right-1 bottom-1 bg-slate-300/90">
               <p class="tour-date"> ${format(
                 new Date(tour.startTime),
                 "dd MMMM",
                 { locale: ru }
                  )} - ${format(new Date(tour.endTime), "dd MMMM   ", {
                 locale: ru
                 })}  ${duration} дней</p>

               <div class="flex items-center mx-5 text-slate-500">
                   <i class="fa-solid fa-ruble-sign"></i>
                   <p class="tour-price" id="reservaition_price">${tour.price}</p>
               </div>
            </div>  
        </div> 
    </div>
    `    
}

const inputFirstName = document.getElementById('firstName')
const inputLastName = document.getElementById('lastName')
const inputPhone = document.getElementById('phone')
const inputEmail = document.getElementById('email')
const inputComment = document.getElementById('comment')

async function sendOrderRequest(){
  console.log(currentReservationTourId)

  const firstName = inputFirstName.value
  const lastName = inputLastName.value
  const phone = inputPhone.value
  const email = inputEmail.value
  const comment = inputComment.value

  const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${currentReservationTourId}`
  console.log(url)

  const params = {
    customerName: firstName + lastName,
    phone: phone,
    email: email,
    description: comment                      
  }
  console.log(params)

  if(validate(firstName, lastName, phone, email,  inputFirstName, inputLastName, inputEmail )){
    try{
        let response = await fetch( url, {
        method: "POST",
        body: JSON.stringify(params)
        })

        let data = await response.json()
        console.log(data)

        closeModalReservation()
        showAnswerToRequest()
    }catch{
        alert("Ошибка, попробуйте позже.")
    }    
  }
}

function validate(firstName, lastName, phone, email,  inputFirstName, inputLastName, inputEmail ) {
      if (firstName == false){
        inputFirstName.value = "Укажите свое имя!"
        inputFirstName.style.color = "red"

      } if (lastName == false){
        inputLastName.value = "Укажите фамилию!"
        inputLastName.style.color = "red"
  
      } if (phone == false){
        document.getElementById("phone-label-two").style.display = "flex"
        document.getElementById("phone-label").style.display = "none"
   
      } if (email == false){
        inputEmail.value = "Укажите адрес Вашей почты!"
        inputEmail.style.color = "red"
     
      } if (firstName == false || lastName == false || phone == false || email == false ){
        return false
      }

      return true
}

const getFavoriteTours = () => {
	const favoriteTours = localStorage.getItem('favoriteTours') ? JSON.parse(localStorage.getItem('favoriteTours')) : []
	return favoriteTours
}

async function addToFavorites(tourId, tours) {
    const favoriteToursIds = getFavoriteTours()

    const favoriteTours = tours.filter((t) => {
		const isFavorite = favoriteToursIds.includes(t.id)
		return isFavorite
	})

    const tour = tours.find((t) => {
        return t.id === tourId
    })
    
    const isFavorite = favoriteTours.includes(tour)

    if(isFavorite === false){
        const newFavoriteTours = [...favoriteToursIds, tourId]  
        localStorage.setItem('favoriteTours', JSON.stringify(newFavoriteTours))
    }else{
        const index = favoriteToursIds.indexOf(tourId)
        favoriteToursIds.splice(index,1)
        localStorage.setItem('favoriteTours', JSON.stringify(favoriteToursIds))    
    } 
    renderTours(tours)   
}

const renderFavoriteTours = async () => {
	const responce = await fetch(
		"https://www.bit-by-bit.ru/api/student-projects/tours"
	)
	const tours = await responce.json()

	const favoriteToursIds = getFavoriteTours()
	const favoriteTours = tours.filter((tour) => {
		const isFavorite = favoriteToursIds.includes(tour.id)
		return isFavorite
	})

	renderTours(favoriteTours)
}

let isOpenFilterContainer = false
function openFilterContainer(){
    if(isOpenFilterContainer === false){
        document.getElementById("filters").style.display = "grid"
        document.getElementById("filter-button").classList.remove('bg-slate-100')
        document.getElementById("filter-button").classList.add('bg-slate-300')    
        isOpenFilterContainer = true
    }else{
        document.getElementById("filters").style.display = "none"
        document.getElementById("filter-button").classList.remove('bg-slate-300')
        document.getElementById("filter-button").classList.add('bg-slate-100')
        isOpenFilterContainer = false
    }
    document.getElementById("raiting-dropbox-button").addEventListener('click', openRaitingDropbox)
    document.getElementById("price-dropbox-button").addEventListener('click', openPriceDropbox)
}

function filterByCountry(tours, country) {
    if(country){
        const filteredTours = tours.filter ((tour) => {
            return tour.country === country
         })
         renderTours(filteredTours)
    } else {
        renderTours(tours)
    }    
}

function filterByRaiting(tours, raiting){
    console.log(raiting)
    const filteredTours = tours.filter ((tour) =>{
        return tour.rating >= raiting
    })
    renderTours(filteredTours)
}

let isOpenRaitingDropbox = false
async function openRaitingDropbox(){
    if(isOpenRaitingDropbox === false){
        document.getElementById("raiting-dropbox").style.display = "grid"
        document.getElementById("raiting-dropbox-button").classList.remove('bg-slate-100')
        document.getElementById("raiting-dropbox-button").classList.add('bg-slate-300')
        isOpenRaitingDropbox = true
    }else{
        document.getElementById("raiting-dropbox").style.display = "none"
        document.getElementById("raiting-dropbox-button").classList.remove('bg-slate-300')
        document.getElementById("raiting-dropbox-button").classList.add('bg-slate-100')
        isOpenRaitingDropbox = false
    }
    const responce = await fetch(
		"https://www.bit-by-bit.ru/api/student-projects/tours"
	)
	tours = await responce.json()
    document.getElementById("raiting-1").addEventListener("click", async () => {filterByRaiting(tours, 1) })
    document.getElementById("raiting-2").addEventListener("click", async () => {filterByRaiting(tours, 2) })
    document.getElementById("raiting-3").addEventListener("click", async () => {filterByRaiting(tours, 3) })
    document.getElementById("raiting-4").addEventListener("click", async () => {filterByRaiting(tours, 4) })
    document.getElementById("raiting-5").addEventListener("click", async () => {filterByRaiting(tours, 5) })
    document.getElementById("raiting-6").addEventListener("click", async () => {filterByRaiting(tours, 6) })
    document.getElementById("raiting-7").addEventListener("click", async () => {filterByRaiting(tours, 7) })
    document.getElementById("raiting-8").addEventListener("click", async () => {filterByRaiting(tours, 8) })
    document.getElementById("raiting-9").addEventListener("click", async () => {filterByRaiting(tours, 9) })
}

function filterByPrice(tours){
    const minPrice = document.getElementById("min-price").value
    const maxPrice = document.getElementById("max-price").value
    console.log(minPrice, maxPrice)
    const filteredTours = tours.filter ((tour) =>{
       if(tour.price >= minPrice && tour.price <= maxPrice){
        return tour.price
       }
    })
    
    renderTours(filteredTours)
}

let isOpenPriceDropbox = false
async function openPriceDropbox(){
    if(isOpenPriceDropbox === false){
        document.getElementById("price-dropbox").style.display = "flex"
        document.getElementById("price-dropbox-button").classList.remove('bg-slate-100')
        document.getElementById("price-dropbox-button").classList.add('bg-slate-300')
        isOpenPriceDropbox = true
    }else{
        document.getElementById("price-dropbox").style.display = "none"
        document.getElementById("price-dropbox-button").classList.remove('bg-slate-300')
        document.getElementById("price-dropbox-button").classList.add('bg-slate-100')
        isOpenPriceDropbox = false
    }
    const responce = await fetch(
		"https://www.bit-by-bit.ru/api/student-projects/tours"
	)
	tours = await responce.json()

    

    document.getElementById('price-dropbox-button-show').addEventListener("click", async () => {filterByPrice(tours)})
}

// const toursFilterByCountry = filterByCountry(tours, "Индонезия")

// function filterByAllFilters()

function removeUpperContainer(tour) {
    const upperContainer = document.getElementById(`container-upper-${tour.id}`)
    upperContainer.style.display = "none"
}

function returnUpperContainer(tour) {
    const upperContainer = document.getElementById(`container-upper-${tour.id}`)
    upperContainer.style.display = "flex"
}

function closeModalReservation(){
    const modalReservation = document.getElementById("modal-reservation")
    modalReservation.style.display = "none"
    clearContainerReservationTour()
    clearForm()
    changeTextColorInputPhone()   
}

function showAnswerToRequest(){
    document.getElementById("answer-to-request").style.display = "flex"
}

function clearContainerReservationTour() {
    document.getElementById('reservaition_container').innerHTML = ''
}

function clearForm(){
    inputFirstName.value = ""
    inputLastName.value = ""
    inputPhone.value = ""
    inputEmail.value = ""
    inputComment.value = ""
}

function closeAnswerToRequest(){
    document.getElementById("answer-to-request").style.display = "none"
}

function changeTextColorInputFirstName() {
    inputFirstName.style.color = "black"
    inputFirstName.value = ""
}
inputFirstName.addEventListener("click", changeTextColorInputFirstName)

function changeTextColorInputLastName() {
    inputLastName.style.color = "black"
    inputLastName.value = ""
}
inputLastName.addEventListener("click", changeTextColorInputLastName)

function changeTextColorInputPhone() {
    document.getElementById("phone-label-two").style.display = "none"
    document.getElementById("phone-label").style.display = "flex"
}

function changeTextColorInputEmail() {
    inputEmail.style.color = "black"
    inputEmail.value = ""
}
inputEmail.addEventListener("click", changeTextColorInputEmail)



const buttonSendOrderRequest = document.getElementById("sendOrderRequest_button")
buttonSendOrderRequest.addEventListener("click", sendOrderRequest)

const buttonCloseModalReservation = document.getElementById("close_Modal_Reservation-button")
buttonCloseModalReservation.addEventListener("click", closeModalReservation)

const buttonCloseAnswerToRequest = document.getElementById("answer-to-request_close_Button")
buttonCloseAnswerToRequest.addEventListener("click", closeAnswerToRequest)

document.getElementById("favorite-tours-btn").addEventListener('click', renderFavoriteTours)

document.getElementById("filter-button").addEventListener('click', openFilterContainer)




init()



