import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.className = 'cards-wrapper-' + index;
  });
  const [firstRow, secondRow] = block.children;
  const table = firstRow.querySelector('table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const ul = document.createElement('ul');

  tbody.querySelectorAll('tr').forEach(tr => {
    const li = document.createElement('li');

    const picture = tr.querySelector('picture').cloneNode(true);
    li.classList.add('card-container')
    li.appendChild(picture);
    const tdElements = tr.querySelectorAll('td');
    const wrapper = document.createElement('div');
    tdElements.forEach(td => {
      const p = document.createElement('p');
      if (td.textContent.trim().length) {
        p.textContent = td.textContent;
        wrapper.appendChild(p);
      }
    });
    li.append(wrapper)
    ul.appendChild(li);
  });
  table.parentNode.replaceChild(ul, table);
  block.querySelector('.cards-wrapper-0').append(ul);

  createRightSection(secondRow);
}

function createRightSection(rightSec) {
  const rows = Array.from(document.querySelector('table tbody').children);
  const tabContainer = document.createElement('div');
  tabContainer.classList.add('tabs');
  rows.forEach((row, index) => {
    const titleCell = row.children[0];
    titleCell.classList.add('title-cell')
    const contentCell = row.children[1];
    const tabButton = document.createElement('button');
    const icon = titleCell.querySelector('picture');
    tabButton.textContent = titleCell.textContent;
    tabButton.appendChild(icon);
    tabButton.classList.add('tab-button');
    tabButton.setAttribute('data-index', index);

    if (index !== 0) {
      contentCell.style.display = 'none';
    }

    tabContainer.appendChild(tabButton);
  });
  rightSec.insertBefore(tabContainer, rightSec.firstChild);
  rightSec.querySelector('.tab-button').classList.add('active')
  rightSec.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      rightSec.querySelector('.active')?.classList.remove('active')
      this.classList.add('active')
      rows.forEach((row, rowIndex) => {
        const contentCell = row.children[1];
        if (rowIndex == index) {
          contentCell.style.display = '';
          contentCell.classList.add('active')
        } else {
          contentCell.style.display = 'none';
          contentCell.classList.remove('active')
        }
      });
    });
  });

  rightSec.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.textContent.includes('{{input-field}}')) {
      // Replace the placeholder with an actual input field
      paragraph.innerHTML = paragraph.innerHTML.replace(
        '{{input-field}}',
        '<input type="text" class="tracking-input" placeholder="Tracking or infoNotice Number">'
      );
    }
    if (paragraph.textContent.includes('{{button}}')) {
      // Replace the placeholder with an actual input field
      paragraph.innerHTML = paragraph.innerHTML.replace(
        '{{button}}',
        '<button type="button" class="track-package-btn">Track Package</button>'
      );
    }

  });

  rightSec.querySelector('.track-package-btn')?.closest('p')?.classList.add('help-section');
  rightSec.querySelector('tbody tbody').classList.add('track-section')

  var tableBody = rightSec.querySelector('.track-section');
  var cardContainer = document.createElement('div');
  cardContainer.className = 'right-card-container';
  Array.from(tableBody.rows).forEach(function (row, index) {
    if (index === 0) {
      var heading = document.createElement('h3');
      heading.textContent = row.cells[0].textContent;
      row.replaceChild(heading, row.querySelector('td'))
    } else {
      row.classList.add('card-container-track')
    }
  })
}
