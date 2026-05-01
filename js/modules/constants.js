// Предустановленные пользователи
export const DEFAULT_USERS = [
    { email: "marketer@basalt.ru", password: "marketer123", role: "marketer", lastName: "Смирнов", firstName: "Алексей", patronymic: "Сергеевич", phone: "+7 (999) 111-22-33", position: "Маркетолог" },
    { email: "operator@basalt.ru", password: "operator123", role: "operator", lastName: "Иванов", firstName: "Иван", patronymic: "Иванович", phone: "+7 (999) 123-45-67", position: "Оператор" },
    { email: "admin@basalt.ru", password: "admin123", role: "admin", lastName: "Петров", firstName: "Петр", patronymic: "Петрович", phone: "+7 (999) 765-43-21", position: "Администратор" }
];

// Данные компаний с контактами
export const DEMO_COMPANIES = [
    { id: 1, name: "ООО «Базальт-Тех»", url: "https://basalt-tech.ru", description: "Производство базальтового волокна и композитных материалов", email: "info@basalt-tech.ru", phone: "+7 (495) 123-45-67", address: "г. Москва, ул. Строителей, 15" },
    { id: 2, name: "АО «Композитные технологии»", url: "https://composite-tech.ru", description: "Разработка и производство композитных армирующих сеток", email: "sales@composite-tech.ru", phone: "+7 (812) 765-43-21", address: "г. Санкт-Петербург, Невский пр., 100" },
    { id: 3, name: "ООО «Огнезащита-Строй»", url: "https://ogne-zashita.ru", description: "Огнезащитные составы и покрытия для строительства", email: "zakaz@ogne-zashita.ru", phone: "+7 (843) 222-33-44", address: "г. Казань, ул. Пожарная, 7" },
    { id: 4, name: "Научно-производственный центр «Соли»", url: "https://salt-center.ru", description: "Химические композиты на основе солей и катализаторов", email: "lab@salt-center.ru", phone: "+7 (383) 555-66-77", address: "г. Новосибирск, пр. Академика, 22" },
    { id: 5, name: "ООО «Базальт-Инвест»", url: "https://basalt-invest.ru", description: "Инвестиции в проекты базальтового волокна", email: "invest@basalt-invest.ru", phone: "+7 (499) 888-99-00", address: "г. Москва, ул. Тверская, 10" }
];