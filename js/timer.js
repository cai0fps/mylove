export function initTimer(startDateString) {
    const startDate = new Date(startDateString);
    
    function updateCounter() {
        const now = new Date();
        if (now < startDate) return;

        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        let hours = now.getHours() - startDate.getHours();
        let minutes = now.getMinutes() - startDate.getMinutes();
        let seconds = now.getSeconds() - startDate.getSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            // Dias no mês anterior
            const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonthDate.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        const elYears = document.getElementById('years');
        const elMonths = document.getElementById('months');
        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMinutes = document.getElementById('minutes');
        const elSeconds = document.getElementById('seconds');

        if (elYears) elYears.innerText = years;
        if (elMonths) elMonths.innerText = months;
        if (elDays) elDays.innerText = days;
        if (elHours) elHours.innerText = hours;
        if (elMinutes) elMinutes.innerText = minutes;
        if (elSeconds) elSeconds.innerText = seconds;
    }
    
    setInterval(updateCounter, 1000);
    updateCounter();
}
