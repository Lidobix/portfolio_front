import datasManager from './datasManager.mjs';
import { domCreator } from './domCreator.mjs';
const DomCreator = new domCreator();

class SiteBuilder {
  constructor() {
    this.body = document.querySelector('body');
    this.header = document.querySelector('header');
    this.nav = document.querySelector('nav');
    this.section = document.querySelector('section');
  }

  buildHeader() {
    const { header, socials } = datasManager;
    if (header !== null) {
      DomCreator.appendChilds(this.header, [
        DomCreator.createNode('h1', [], {
          innerText: header.title,
        }),
        DomCreator.createNode('h2', [], {
          innerText: header.subtitle,
        }),
      ]);
    }

    if (socials.length) {
      const socialContainer = DomCreator.createNode('div', ['socialContainer']);

      socials.forEach((social) => {
        const a = DomCreator.createNode('a', [], { href: social.url });
        DomCreator.createNodeAppended('img', [], { src: social.picto }, a);
        socialContainer.appendChild(a);
      });

      this.header.appendChild(socialContainer);
    }

    DomCreator.createNodeAppended(
      'img',
      ['invisible', 'transition100'],
      {
        id: 'navArrowTop',
        src: './assets/images/top_arrow.png',
      },
      this.body
    );
  }

  buildSection() {
    const { section, stack, projects } = datasManager;
    if (section !== null) {
      section.forEach((paragraph) => {
        if (paragraph.display) {
          this.buildSectionParagraph(paragraph);
        }
      });

      if (stack !== null) {
        this.buildIllustrations(stack, document.getElementById('pFormation'));
      }

      if (projects !== null) {
        this.buildProjects(projects);
      }
    }
  }

  buildSectionParagraph(paragraph) {
    const anchorCalc = paragraph.name
      .toLowerCase()
      .split(' ')
      .sort((a, b) => b.length - a.length)[0];

    const title = DomCreator.createNode('h3', [], {
      innerText: paragraph.name,
      id: anchorCalc,
    });

    this.section.appendChild(title);

    if (paragraph.text) {
      DomCreator.createNodeAppended(
        'p',
        [],
        { id: `p${paragraph.name}`, innerText: paragraph.text },
        this.section
      );
    }

    if (paragraph.illustrations && paragraph.illustrations.length !== 0) {
      this.buildIllustrations(paragraph.illustration, this.section);
    }

    if (paragraph.htmlForm) {
      this.buildForm(paragraph.htmlForm);
    }
  }

  buildNav() {
    const { nav } = datasManager;

    if (nav !== null) {
      this.buildNavMenu(nav);
    }
    this.buildNavToggle();
  }

  buildIllustrations(illustrations, parent) {
    const imagesContainer = DomCreator.createNode('div', ['imagesContainer']);

    illustrations.forEach((imageUrl) => {
      DomCreator.createNodeAppended(
        'img',
        [],
        { src: imageUrl },
        imagesContainer
      );
    });
    parent.after(imagesContainer);
  }

  buildNavMenu(nav) {
    const navItems = [];
    this.nav.classList.add('transition300');

    nav.forEach((navElement) => {
      navItems.push({
        name: navElement,
        anchor: `#${navElement.toLowerCase()}`,
      });
    });

    const ul = document.createElement('ul');

    navItems.forEach((item) => {
      const li = document.createElement('li');
      const a = DomCreator.createNode('a', [], {
        href: item.anchor,
        innerText: item.name,
      });

      li.appendChild(a);
      ul.appendChild(li);
      this.nav.appendChild(ul);
    });
  }

  buildNavToggle() {
    const navToggle = DomCreator.createNode(
      'div',
      ['mobile', 'navTrigger', 'transition100'],
      {
        id: 'navToggle',
      }
    );

    for (let i = 0; i < 3; i++) {
      const bullet = DomCreator.createNode('div', ['navTrigger']);
      navToggle.appendChild(bullet);
    }

    this.header.appendChild(navToggle);
  }

  buildProjects(projects) {
    const container = DomCreator.createNode('div', [], { id: 'projectList' });

    projects.forEach((project) => {
      if (project.display) {
        const card = DomCreator.createNode(
          'div',
          ['card', 'transition100', 'borderRad_02'],
          {
            id: `project${project.name}`,
          }
        );

        if (project.images) {
          const figure = document.createElement('figure');
          const view = DomCreator.createNode('img', [], {
            src: project.images[0],
          });
          figure.appendChild(view);
          card.appendChild(figure);
        }
        const description = DomCreator.createNode(
          'div',
          ['cardDescription'],
          {}
        );
        const projectTitle = DomCreator.createNode('h4', [], {
          innerText: project.name,
        });
        description.appendChild(projectTitle);

        const type = DomCreator.createNode('p', [], {
          innerText: project.type,
        });
        description.appendChild(type);

        const aHref = DomCreator.createNode(
          'a',
          [project.link ? 'enabledLink' : 'disabledLink', 'borderRad_01'],

          {
            innerText: 'Visiter',
          }
        );

        project.link ? (aHref.href = project.link) : null;
        description.appendChild(aHref);

        const summary = DomCreator.createNode('p', [], {
          innerText: project.description,
        });
        description.appendChild(summary);

        if (project.technos.length) {
          const technoListContainer = DomCreator.createNode('div', [
            'technoListContainer',
          ]);
          const technoList = DomCreator.createNode('div', [
            'technoList',
            'borderRad_02',
          ]);

          project.technos?.forEach((techno) => {
            const logo = DomCreator.createNode('img', [], {
              src: `assets/images/${techno.toLowerCase()}.png`,
            });

            technoList.appendChild(logo);
          });
          technoListContainer.appendChild(technoList);
          description.appendChild(technoListContainer);
          card.appendChild(description);
        }
        container.appendChild(card);
      }
    });

    document.getElementById('projets').after(container);
  }

  buildForm(htmlForm) {
    const form = DomCreator.createNode('form', [], {
      id: 'formulaire',
      innerHTML: htmlForm,
      method: 'POST',
    });
    const formContainer = DomCreator.createNode('div', [
      'formContainer',
      'borderRad_02',
    ]);

    formContainer.appendChild(form);

    document.getElementById('contact').after(formContainer);
    document.getElementById('submitButton').classList.add('borderRad_01');
  }

  buildFormModal(title, message) {
    const titleContainer = DomCreator.createNode(
      'div',
      ['modalTitleContainer'],
      { innerText: title }
    );
    const messageContainer = DomCreator.createNode('div', [
      'modalMessageContainer',
    ]);
    const modalContainer = DomCreator.createNode('div', ['modalContainer']);
    const text = DomCreator.p(message);
    const closeButton = DomCreator.createNode('button', ['border_01'], {
      innerText: 'FERMER',
    });

    DomCreator.appendChilds(messageContainer, [text, closeButton]);
    DomCreator.appendChilds(modalContainer, [titleContainer, messageContainer]);
    DomCreator.appendChilds(this.body, [modalContainer]);

    closeButton.addEventListener('click', () => {
      modalContainer.remove();
    });
  }
}

export const buildSite = () => {
  const siteBuilder = new SiteBuilder();

  siteBuilder.buildHeader();
  siteBuilder.buildNav();
  siteBuilder.buildSection();
};
