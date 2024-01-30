import { format, differenceInDays } from "date-fns";
import { da, ru } from "date-fns/locale"

let currentReservationTourId


async function renderTours() {
    const responce = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const tours = await responce.json()
    console.log(tours)

    const container = document.getElementById("container-tours")

    tours.forEach((tour) => {
        const duration = differenceInDays(
            new Date(tour.endTime),
            new Date(tour.startTime)
        )

        const city = tour.city
        console.log(city)

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
                                   <i class="fa-regular fa-heart"></i>
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
            currentReservationTourId = tour.id
            addToFavorites()
        })
    })
}

async function openModalReservation() {
    const responce = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const tours = await responce.json()

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


async function sendOrderRequest(){
  console.log(currentReservationTourId)
  closeModalReservation()

  const firstName = document.getElementById('firstName').value
  const lastName = document.getElementById('lastName').value
  const phone = document.getElementById('phone').value
  const email = document.getElementById('email').value
  const comment = document.getElementById('comment').value

  const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${currentReservationTourId}`
  console.log(url)


  const params = {
    customerName: firstName + lastName,
    phone: phone,
    email: email,
    description: comment                      
  }
  console.log(params)

  let response = await fetch( url, {
    method: "POST",
    body: JSON.stringify(params)
  })

  let data = await response.json()
  console.log(data)

  alert(data)

  closeModalReservation()
}

async function addToFavorites() {
    const responce = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const tours = await responce.json()

    const tour = tours.find((t) => {
        return t.id === currentReservationTourId
    })

    const duration = differenceInDays(
      new Date(tour.endTime),
      new Date(tour.startTime)
    )

  const containerFavorites = document.getElementById("container-tours-favorites")
  console.log(containerFavorites)
  containerFavorites.innerHTML +=  `
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
         <button class="tour-button w-full" id="modalReservation_open-button--${
             tour.id
         }">Забронировать</button>
     </div>
  </div>  
  `
}

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
}


function clearContainerReservationTour() {
    document.getElementById('reservaition_container').innerHTML = ''
}

const buttonSendOrderRequest = document.getElementById("sendOrderRequest_button")
buttonSendOrderRequest.addEventListener("click", sendOrderRequest)

const buttonCloseModalReservation = document.getElementById("close_Modal_Reservation-button")
buttonCloseModalReservation.addEventListener("click", closeModalReservation)

renderTours()
