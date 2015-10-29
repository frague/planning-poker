angular.module('planningPoker.constants', [])

    .constant('endpoint', '')

    .constant('templatesPath', './')

    .constant('internalPages', ['/logout', '/users', '/digest', '/dashboard'])

    .constant('externalPages', ['/home', '/resetpassword', '/signup'])

    .constant('states', ['unset', 'true', 'false'])

    .constant('months', ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'])

    .constant('monthsFrom', ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'])

    .constant('weekDays', ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']);
