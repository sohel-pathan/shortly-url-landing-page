// select elment
const form = document.getElementById('form');
const linkList = document.getElementById('links_list');
const navbar = document.getElementById('navbar_links');
const mobileMenu = document.getElementById('mobileMenu');

// handle navbar

// function for open navbar
mobileMenu.addEventListener('click', () => {
  navbar.classList.toggle('active');
  mobileMenu.querySelector('.fa-solid').classList.toggle('fa-xmark');
});

// function for closing navbar
navbar.addEventListener('click', (e) => {
  let target = e.target;
  if (target.id === 'navbar_links' || target.tagName === 'A') {
    navbar.classList.remove('active');
    mobileMenu.querySelector('.fa-solid').classList.remove('fa-xmark');
  }
});

// array for links
const linksArr = [];

// function for copy button
const copyUrl = (e) => {
  let target = e.target;
  let shortLink =
    target.parentElement.querySelector('.shorten_link').textContent;
  navigator.clipboard.writeText(shortLink);
  // when click on the copy button change color and text of copy button
  let clicked = false;
  if (!clicked) {
    target.textContent = 'Copied!';
    target.style.backgroundColor = '#3b3054';
    clicked = true;
    return setTimeout(() => {
      target.textContent = 'Copy';
      target.style.backgroundColor = '#2acfcf';
      clicked = false;
    }, 800);
  }
};

// render links item
const renderLinksList = () => {
  linkList.innerHTML = '';

  // only 5 links item on the page
  if (linksArr.length > 5) {
    linksArr.pop();
  }

  // create list item for each links item
  linksArr.forEach((url) => {
    let linksListItem = document.createElement('div');
    linksListItem.classList.add('link_item');

    // remove protocol and  subdomain name from original link
    let ogLink = url.originalLink.replace(
      /http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/g,
      ''
    );

    // original links
    let urlPara = document.createElement('div');
    urlPara.classList.add('original_link');
    urlPara.innerHTML = `<p>${
      // oglink contain only 35 character for adjusting width
      ogLink.length > 35 ? ogLink.substring(35, 0) + '...' : ogLink
    }</p>`;

    // short link
    let shortUrlPara = document.createElement('div');
    shortUrlPara.innerHTML = `<p> ${url.shortLink} </p>`;
    shortUrlPara.classList.add('shorten_link');

    // copy button for link
    let copyBtn = document.createElement('button');
    copyBtn.classList.add('copy_button');
    copyBtn.classList.add('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = copyUrl;

    // Append elements to the list
    linksListItem.appendChild(urlPara);
    linksListItem.appendChild(shortUrlPara);
    linksListItem.appendChild(copyBtn);
    linkList.appendChild(linksListItem);
  });
};

// fetch api
const fetchApi = (originalLink) => {
  // fetch api
  const fetchPromise = fetch(
    `https://api.shrtco.de/v2/shorten?url=${originalLink}`
  );

  fetchPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.ok) {
        throw new Error(data.error);
      }
      linksArr.unshift({
        originalLink: data.result.original_link,
        shortLink: data.result.short_link,
        id: data.result.code,
      });
      return renderLinksList();
    })
    .catch((error) => {
      alert(error);
    });
};

// url validation using RegExp
function isUrlvalid(url) {
  let urlRegeExp = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))|' + // OR ip (v4) address
      'localhost' + // OR localhost
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return urlRegeExp.test(url);
}

// get link from user and update on the link list
const genrateShorteUrl = (e) => {
  e.preventDefault();
  const originalLink = form['link'].value;

  // return alert if link is not valid
  if (!isUrlvalid(originalLink)) {
    form['link'].value = '';
    return alert('enter valid link');
  } else {
    fetchApi(originalLink);
    form['link'].value = '';
  }
};

// get link from user and update links list
form.addEventListener('submit', genrateShorteUrl);
