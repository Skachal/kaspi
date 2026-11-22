/* ===================== ДАННЫЕ ===================== */
const ICON = n => `./img/icons/${n}.png`;

const SECTIONS = {
    shop:      { title: 'Магазин',   icon: 'shop',      text: 'Товары с доставкой и в рассрочку.',       items: ['Смартфоны и гаджеты', 'Бытовая техника', 'Одежда и обувь', 'Дом и сад', 'Красота и здоровье'] },
    bank:      { title: 'Мой Банк',  icon: 'bank',      text: 'Карты, счета и депозиты в одном месте.',  items: ['Kaspi Gold', 'Kaspi Red', 'Депозиты', 'Кредиты', 'Выписка по счёту'] },
    payments:  { title: 'Платежи',   icon: 'payments',  text: 'Оплата услуг без комиссии.',              items: ['Мобильная связь', 'Коммунальные услуги', 'Интернет и ТВ', 'Налоги и штрафы', 'Образование'] },
    transfers: { title: 'Переводы',  icon: 'transfers', text: 'Переводы по номеру телефона и на карты.', items: ['По номеру телефона', 'На карту другого банка', 'Между своими счетами', 'История переводов'] },
    magnum:    { title: 'Magnum',    icon: 'magnum',    text: 'Продукты с быстрой доставкой.',           items: ['Акции недели', 'Фрукты и овощи', 'Молочные продукты', 'Хлеб и выпечка', 'Напитки'] },
    travel:    { title: 'Travel',    icon: 'travel',    text: 'Билеты и отели по выгодным ценам.',       items: ['Авиабилеты', 'Ж/д билеты', 'Отели', 'Автобусы'] },
    gov:       { title: 'Госуслуги', icon: 'gov',       text: 'Справки и услуги онлайн.',                items: ['Справки', 'Недвижимость и транспорт', 'Семья и дети', 'Налоги'] },
    kasper:    { title: 'Kasper',    icon: 'kasper',    text: 'Ваш умный помощник.',                     items: ['Задать вопрос', 'Подсказки', 'История диалогов'] },
    cart:      { title: 'Корзина',   icon: 'cart',      text: 'Товаров в корзине: 43.',                  items: [] }
};

const MESSAGES = [
    { name: 'Kaspi Банк',      time: '16:02', text: 'Платёж выполнен успешно.',        unread: 3 },
    { name: 'Kaspi Магазин',   time: '14:40', text: 'Ваш заказ передан в доставку.',   unread: 12 },
    { name: 'Magnum',          time: '11:15', text: 'Скидки на продукты до 30%.',      unread: 8 },
    { name: 'Госуслуги',       time: 'Вчера', text: 'Справка готова к получению.',     unread: 1 },
    { name: 'Kaspi Travel',    time: 'Вчера', text: 'Билеты на ближайшие даты.',       unread: 0 },
    { name: 'Kasper',          time: 'Пн',    text: 'Чем могу помочь сегодня?',        unread: 34 }
];

/* ===================== ПОМОЩНИКИ ===================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let toastTimer;
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('toast--show'), 1800);
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ===================== ЗАСТАВКА ===================== */
window.addEventListener('load', () => {
    const splash = $('#splash');
    setTimeout(() => {
        splash.classList.add('splash--hide');
        setTimeout(() => splash.remove(), 400);
    }, 1500);
});

/* ===================== ВКЛАДКИ ===================== */
function showTab(name) {
    $$('.view').forEach(v => v.classList.toggle('view--active', v.id === 'view-' + name));
    $$('.tab').forEach(tab => {
        const on = tab.dataset.tab === name;
        tab.classList.toggle('tab--active', on);
        const img = $('img', tab);
        img.src = on ? img.dataset.on : img.dataset.off;
    });
    window.scrollTo(0, 0);
}
$$('.tab').forEach(tab => tab.addEventListener('click', () => {
    closePage(true);
    showTab(tab.dataset.tab);
}));

/* ===================== СПИСКИ (сообщения, сервисы) ===================== */
$('#messagesList').innerHTML = MESSAGES.map((m, i) => `
    <li><button class="list__item" data-msg="${i}">
        <span class="list__ico list__ico--dot">${esc(m.name[0])}</span>
        <span class="list__main">
            <div class="list__title">${esc(m.name)}</div>
            <div class="list__sub">${esc(m.text)}</div>
        </span>
        <span class="list__side">
            <span class="list__time">${esc(m.time)}</span>
            ${m.unread ? `<span class="list__unread">${m.unread}</span>` : '<span class="list__unread list__unread--empty"></span>'}
        </span>
    </button></li>`).join('');

$('#servicesList').innerHTML = Object.entries(SECTIONS).filter(([k]) => k !== 'cart').map(([k, s]) => `
    <li><button class="list__item" data-open="${k}">
        <span class="list__ico"><img src="${ICON(s.icon)}" alt="" style="height:30px;width:auto"></span>
        <span class="list__main"><div class="list__title">${esc(s.title)}</div></span>
        <span class="list__chev"></span>
    </button></li>`).join('');

/* ===================== ВНУТРЕННЯЯ СТРАНИЦА ===================== */
const page = $('#page');
let pageOpen = false;

function skeletonLines(n = 4) {
    return `<div class="page__sk">${Array.from({ length: n }, (_, i) =>
        `<div class="skeleton sk-line" style="width:${100 - i * 12}%"></div>`).join('')}</div>`;
}

function openPage(title, html, pushState = true) {
    $('#pageTitle').textContent = title;
    $('#pageBody').innerHTML = html;
    page.scrollTop = 0;
    page.classList.add('page--open');
    page.setAttribute('aria-hidden', 'false');
    if (!pageOpen && pushState) history.pushState({ page: true }, '');
    pageOpen = true;
}

function closePage(silent = false) {
    if (!pageOpen) return;
    page.classList.remove('page--open');
    page.setAttribute('aria-hidden', 'true');
    pageOpen = false;
    if (silent && history.state && history.state.page) history.back();
}

function openSection(key) {
    const s = SECTIONS[key];
    if (!s) return;
    const rows = s.items.map(it => `
        <li><button class="list__item" data-soon="${esc(it)}">
            <span class="list__main"><div class="list__title">${esc(it)}</div></span>
            <span class="list__chev"></span>
        </button></li>`).join('');
    openPage(s.title, `
        <div class="page__hero"><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div>
        ${rows ? `<ul class="list" style="margin-top:14px">${rows}</ul>` : skeletonLines(6)}
    `);
}

function openMessage(i) {
    const m = MESSAGES[i];
    openPage(m.name, `
        <div class="page__hero"><h2>${esc(m.name)}</h2><p>${esc(m.time)}</p></div>
        <div class="page__hero"><p style="color:#222;font-size:16px">${esc(m.text)}</p></div>
        ${skeletonLines(3)}
    `);
}

$('#backBtn').addEventListener('click', () => closePage(true));
window.addEventListener('popstate', () => closePage(false));

/* ===================== ОБЩИЙ ОБРАБОТЧИК КЛИКОВ ===================== */
document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { openSection(open.dataset.open); return; }

    const msg = e.target.closest('[data-msg]');
    if (msg) { openMessage(+msg.dataset.msg); return; }

    const soon = e.target.closest('[data-soon]');
    if (soon) { toast(`«${soon.dataset.soon}» — скоро будет доступно`); }
});

/* ===================== ПОИСК И КАМЕРА ===================== */
$('#searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = $('#searchInput').value.trim();
    if (!q) { toast('Введите запрос'); return; }
    $('#searchInput').blur();
    openPage('Поиск', `
        <div class="page__hero"><h2>Результаты по запросу</h2><p>«${esc(q)}»</p></div>
        <div class="skeleton wide" style="margin-top:20px"></div>
        ${skeletonLines(5)}
    `);
});

$('#cameraBtn').addEventListener('click', () => $('#cameraInput').click());
$('#cameraInput').addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) toast('Фото выбрано: ' + f.name);
    e.target.value = '';
});

$('#qrBtn').addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast('Камера недоступна в этом браузере'); return; }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        stream.getTracks().forEach(t => t.stop());
        toast('Камера доступна');
    } catch {
        toast('Нет доступа к камере');
    }
});
