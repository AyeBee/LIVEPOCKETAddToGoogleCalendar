// ==UserScript==
// @name         livepocketのイベント概要Googleカレンダー連携
// @namespace    http://ayebee.net/
// @version      1.2
// @description  livepocketのイベント概要ページに、イベント内容のGoogleカレンダー登録ボタンを追加します。
// @author       ayebee
// @match        https://t.livepocket.jp/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livepocket.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
 
    const title = document.querySelector('#eventTitle > section > h1').textContent.trim();
    const artists = document.querySelector('#information section.data > section.artist > div').textContent.trim();
    const date = document.querySelector('#information section.day > div > p:nth-child(1)').textContent.replace(/\s/g, '').match(/\d{4}\/\d{1,2}\/\d{1,2}/)[0].replace(/\//g, '-');
    const time = document.querySelector('#information section.day > div > p:nth-child(2)').textContent.replace(/\s/g, '').match(/\d{1,2}:\d{1,2}/g);
    const place = document.querySelector('#information section.data > section.venue > div > p:nth-child(1) > a:nth-child(1)').textContent.replace(/\s/g, '');
    const address = document.querySelector('#information section.data > section.venue > div > p:nth-child(2)').textContent.replace(/\s/g, '');

    const start = new Date(`${date} ${time[1]}`);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const p = (v, n=2, s='0') => String(v).padStart(n, s);
    const formatDate = d => `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;

    const data = {
        text: title,
        artists,
        dates: `${formatDate(start)}/${formatDate(end)}`,
        location: `${place}, ${address}`,
        description: document.querySelector('#js_intro').textContent.trim()
    };

    data.details = `
    出演者: ${data.artists}
    日程: ${date} 開場${time[0]} 開演${time[1]}
    会場: ${data.location}
    
    ${data.description}
    `.trim();

    const button = document.createElement('a');
    button.className = 'map-link';
    button.rel = 'external';
    button.textContent = 'Google Calendar に登録';
    button.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${data.text}&dates=${data.dates}&location=${data.location}&details=${encodeURIComponent(data.details)}`;
    document.querySelector('#information section.data').append(button);
})();
