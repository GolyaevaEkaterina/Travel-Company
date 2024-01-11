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
        container.innerHTML += `
        <div class="bg-slate-200 shadow-2xl flex flex-col gap-y-3">
                        <img class="tour-image" src="${tour.image}" />
                        <p class="tour-date"> ${format(
                            new Date(tour.startTime),
                            "dd MMMM",
                            { locale: ru }
                        )} - ${format(new Date(tour.endTime), "dd MMMM", {
                            locale: ru
                        })}  ${duration} дней</p>
                        <h2 class="tour-title">${tour.country}</h2>
                        <p class="tour-price">
                        ${tour.price}
                        </p>
                        <p class="tour-hotel">${tour.hotelName}</p>
                        <div class="flex justify-end mr-5">
                            <button class="tour-button w-1/2">Подробнее</button>
                            <button class="tour-button w-10">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                        </div>
                        `
    })
}

renderTours()
