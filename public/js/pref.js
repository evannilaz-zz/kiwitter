const prefCats = document.querySelectorAll('a.pref-menu');
const changeUn = document.querySelector('#chun');
const catsArr = [...prefCats];
const mtArr = ['16px', '72px', '125px', '182px'];

const msg = {
    fail: {
        format: '<i></i> Please keep the formats provided.',
        already: '<i></i> User with the same username already exists.'
    },
    success: {
        un: '<i></i> Username successfully changed.'
    }
};

const regex = {
    un: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
    nm: /^[a-zA-Z]+$/
};

function showStat(msg) {
    const stat = document.querySelector('span.addit');
    stat.classList.add('hidden');
    stat.innerHTML = msg;
    setTimeout(() => { stat.classList.remove('hidden') }, 250);
}

function loadHTML(hash) {
    fetch(`/html/${hash.slice(1)}.html`).then(async(resp) => {
        const load = document.querySelector('.load');
        const main = document.querySelector('main > .content');
        if (load.classList.contains('hidden')) {
            load.classList.remove('hidden');
            main.innerHTML = '';
        }

        const html = await resp.text();
        
        if (!html.includes('Not Found')) {
            load.classList.add('hidden');
            main.innerHTML = html;
        }

        document.querySelectorAll('main > .content form').forEach((form) => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const ch = form.querySelector('input[type=hidden]').value;
                const val = form.querySelector('input[name=val]').value;
                
                if ((ch === 'un' && !regex.un.test(val)) || (ch === 'nm' && (!regex.nm.test(val.split(' ')[0]) || !regex.nm.test(val.split(' ')[1])))) {
                    showStat(msg.fail.format);
                } else {
                    if (ch === 'un') {
                        fetch('/preferences', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ val })
                        }).then(async(resp) => {
                            const noOverlaps = await resp.json();
                            if (noOverlaps) {
                                e.target.submit();
                            } else {
                                showStat(msg.fail.already);
                            }
                        });
                    } else {
                        e.target.submit();
                    }
                }
            });
        });
    });
}

if (location.hash) {
    const hashElt = document.querySelector(location.hash);
    document.querySelector('.current').classList.remove('current');
    hashElt.classList.add('current');
    document.querySelector('.bar').style.marginTop = mtArr[catsArr.indexOf(hashElt)];
} else {
    location.hash = 'account';
}

loadHTML(location.hash);

prefCats.forEach((prefCat) => {
    prefCat.addEventListener('click', (e) => {
        const mt = mtArr[catsArr.indexOf(e.target)];
        const current = document.querySelector('.current');
        const bar = document.querySelector('.bar');
        bar.style.marginTop = mt;
        
        current.classList.remove('current');
        e.target.classList.add('current');

        loadHTML(e.target.hash);
    });
});