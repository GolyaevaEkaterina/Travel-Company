import { format, differenceInDays } from "date-fns"
import { ru } from "date-fns/locale"

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

        if (city == null){
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
                              <h2 class="tour-title">${tour.country}</h2>
                              <h4 class="tour-city"></h2>
                           </div>

                        </div>
                        <p class="tour-date"> ${format(
                            new Date(tour.startTime),
                            "dd MMMM",
                            { locale: ru }
                        )} - ${format(new Date(tour.endTime), "dd MMMM", {
                            locale: ru
                        })}  ${duration} дней</p>
                        
                        <div class="flex justify-between ml-5 mr-5 items-center">
                           <div class="flex items-center mb-5 text-slate-500">
                             <i class="fa-solid fa-ruble-sign"></i>
                             <p class="tour-price">${tour.price}</p>
                           </div>
                        
                           <div class="flex justify-end">
                               <button class="tour-button w-full">Подробнее</button>
                               <button class="tour-button w-10">
                                   <i class="fa-regular fa-heart"></i>
                               </button>
                           </div>
                        </div>
                        `
        }else{
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
                               <h4 class="tour-city">${tour.city}</h2>
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
                               <button class="tour-button w-full">Подробнее</button>
                               <button class="tour-button w-10">
                                   <i class="fa-regular fa-heart"></i>
                               </button>
                           </div>
                        </div>
                        
                        
                        `
                    }            
    })

    tours.forEach((tour) => {
        const basicContainer = document.getElementById(`container-basic-${tour.id}`)
        const makeRemoveUpperContainer = () => removeUpperContainer(tour)
        basicContainer.addEventListener('mouseover', makeRemoveUpperContainer)
  
        const upperContainer = document.getElementById(`container-upper-${tour.id}`)
        const makeReturnUpperContainer = () => returnUpperContainer(tour)
        basicContainer.addEventListener('mouseout', makeReturnUpperContainer)
  
        })
}



function removeUpperContainer(tour) {
  const upperContainer = document.getElementById(`container-upper-${tour.id}`)
  upperContainer.style.display = "none"
}

function returnUpperContainer(tour) {
  const upperContainer = document.getElementById(`container-upper-${tour.id}`)
  upperContainer.style.display = "flex"
}

renderTours()
