import {
  Header,
  NavElement,
  SiteElements,
  SectionElement,
  Project,
  Site,
} from './types';

window.addEventListener('DOMContentLoaded', function () {
  const site: Site = {
    body: document.querySelector('body')!,
    projectPreview: false,
    sectionPaddingRight: 0,
    headerPaddingRight: 0,
    navToggleRight: 0,
    lastVerticalScrollY: 0,
    lastHorizontalScrollY: 0,
    previewBackgroundDiv: {} as HTMLElement,
    header: {} as HTMLElement,
    section: {} as HTMLElement,
    navToggle: {} as HTMLElement,
    script: document.querySelector('script')!,
    siteElements: {} as SiteElements,
    navToggled: false,

    buildSite: async function (): Promise<void> {
      await this.fetchElements();

      this.body.insertBefore(
        this.buildHeader(this.siteElements.header),
        this.script
      );

      this.header = document.querySelector('header')!;

      this.body.insertBefore(
        this.buildSection(this, this.siteElements.section),
        this.script
      );

      this.section = document.querySelector('section')!;

      document
        .querySelector('header')!
        .appendChild(this.buildNav(this.siteElements.nav));

      if (document.querySelector('header')) {
        document.querySelector('header')?.appendChild(this.buildNavToggle());

        this.navToggle = document.getElementById('navToggle')!;
      }

      document.addEventListener('click', (e) => {
        const nav: HTMLElement = document.querySelector('nav')!;
        const targetEvent: HTMLElement = e.target as HTMLElement;
        if (targetEvent.classList.contains('navTrigger') && !this.navToggled) {
          nav.style.transform = 'translate(-15rem)';
          this.navToggled = true;
        } else {
          nav.style.transform = 'translate(15rem)';
          this.navToggled = false;
        }
        if (this.projectPreview) {
          this.closePreview(this);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && this.projectPreview) {
          this.closePreview(this);
        }
      });

      window.addEventListener('orientationchange', () => {
        if (window.orientation === 0) {
          // Appareil en position portrait
          this.lastHorizontalScrollY = window.scrollY;
          setTimeout(() => {
            window.scroll(0, this.lastVerticalScrollY);
            this.previewBackgroundDiv.style.top =
              this.lastVerticalScrollY + 'px';
            this.previewBackgroundDiv.style.height = window.innerHeight + 'px';
          }, 100);
        } else if (window.orientation === 90 || window.orientation === -90) {
          // Appareil en position paysage

          this.lastVerticalScrollY = window.scrollY;
          setTimeout(() => {
            window.scroll(0, this.lastHorizontalScrollY);
            this.previewBackgroundDiv.style.top =
              this.lastHorizontalScrollY + 'px';
            this.previewBackgroundDiv.style.height = window.innerHeight + 'px';
          }, 100);
        }
      });

      document
        .querySelector('form')
        ?.addEventListener('submit', async (event) => {
          event.preventDefault();
          const form = event.target as HTMLFormElement;
          const formData: FormData = new FormData(form as HTMLFormElement);
          const searchParams = new URLSearchParams(formData as any);
          await fetch('http://localhost:3000/portfolio/contact', {
            method: 'POST',
            body: searchParams.toString(),

            headers: new Headers({
              'Content-Type': 'application/x-www-form-urlencoded',
            }),
          })
            .then((r) => {
              console.log('message envoyé!');
              this.buildFormModal(
                this,
                'MERCI!!',
                'Votre mail a bien été envoyé, je vous répondrai dans les plus brefs délais.'
              );
              form.reset();
            })

            .catch((e) => {
              alert(e + 'Problème technique, veuillez ressayer plus tard');
            });
        });

      this.buildFormModal(
        this,
        'MERCI!!',
        'Votre mail a bien été envoyé, je vous répondrai dans les plus brefs délais.'
      );
    },

    buildFormModal: (levelUp: Site, title: string, message: string) => {
      const modalContainer: HTMLDivElement = document.createElement('div');
      const titleContainer: HTMLDivElement = document.createElement('div');
      const messageContainer: HTMLElement = document.createElement('div');
      const text: HTMLParagraphElement = document.createElement('p');
      const closeButton: HTMLElement = document.createElement('button');

      titleContainer.innerText = title;
      text.innerText = message;
      closeButton.innerText = 'FERMER';

      modalContainer.classList.add('modalContainer');
      titleContainer.classList.add('modalTitleContainer');
      messageContainer.classList.add('modalMessageContainer');

      messageContainer.appendChild(text);
      messageContainer.appendChild(closeButton);
      modalContainer.appendChild(titleContainer);
      modalContainer.appendChild(messageContainer);

      levelUp.body.appendChild(modalContainer);
    },

    closePreview: (levelUp: Site) => {
      document.getElementById('preview')?.remove();

      levelUp.projectPreview = false;

      levelUp.section.style.paddingRight = levelUp.sectionPaddingRight + 'px';
      levelUp.header.style.paddingRight = levelUp.headerPaddingRight + 'px';
      levelUp.navToggle.style.right = levelUp.navToggleRight + 'px';

      levelUp.body.classList.remove('notScrollable');
    },

    buildHeader: (headerElements: Header): HTMLElement => {
      const header: HTMLElement = document.createElement('header');

      const pageTitle: HTMLHeadingElement = document.createElement('h1');
      pageTitle.innerText = headerElements.title;
      const subTitle: HTMLHeadingElement = document.createElement('h2');
      subTitle.innerText = headerElements.subtitle;

      header.appendChild(pageTitle);
      header.appendChild(subTitle);

      if (headerElements.socials.length) {
        const socialContainer: HTMLElement = document.createElement('div');

        socialContainer.classList.add('socialContainer');
        headerElements.socials.forEach((element) => {
          const a: HTMLAnchorElement = document.createElement('a');
          a.href = element.url;
          const picto: HTMLImageElement = document.createElement('img');
          picto.src = element.picto;
          a.appendChild(picto);
          socialContainer.appendChild(a);
        });

        header.appendChild(socialContainer);
      }

      return header;
    },

    buildSection: (
      levelUp: Site,
      sectionElements: SectionElement[]
    ): HTMLElement => {
      const section: HTMLElement = document.createElement('section');
      sectionElements.forEach((sectionElement) => {
        if (sectionElement.display) {
          const title: HTMLHeadingElement = document.createElement('h3');
          title.innerText = sectionElement.name;

          const anchorCalc: string = sectionElement.name
            .toLowerCase()
            .split(' ')
            .sort((a, b) => b.length - a.length)[0];
          title.id = anchorCalc;

          levelUp.siteElements.nav.push({
            name: sectionElement.name,
            anchor: `#${anchorCalc}`,
          });
          section.appendChild(title);

          if (sectionElement.text) {
            const content: HTMLParagraphElement = document.createElement('p');
            content.innerText = sectionElement.text;
            section.appendChild(content);
          }

          if (
            sectionElement.illustrations &&
            sectionElement.illustrations.length !== 0
          ) {
            const imagesContainer: HTMLDivElement =
              document.createElement('div');
            imagesContainer.classList.add('imagesContainer');
            sectionElement.illustrations.forEach((imageUrl) => {
              const image: HTMLImageElement = document.createElement('img');
              image.src = imageUrl;
              imagesContainer.appendChild(image);
            });
            section.appendChild(imagesContainer);
          }

          if (sectionElement.projectList) {
            section.appendChild(
              levelUp.buildProjects(sectionElement.projectList, levelUp)
            );
          }

          if (sectionElement.htmlForm) {
            section.appendChild(levelUp.buildForm(sectionElement.htmlForm));
          }
        }
      });

      return section;
    },

    buildNav: (navElements: NavElement[]): HTMLElement => {
      const ul: HTMLUListElement = document.createElement('ul');
      const nav: HTMLElement = document.createElement('nav');

      navElements.forEach((element) => {
        const li: HTMLLIElement = document.createElement('li');
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = element.anchor;
        a.innerText = element.name;
        li.appendChild(a);
        ul.appendChild(li);
        nav.appendChild(ul);
      });

      return nav;
    },

    buildNavToggle: (): HTMLElement => {
      const navToggle: HTMLElement = document.createElement('div')!;

      navToggle.id = 'navToggle';
      navToggle.classList.add('mobile', 'navTrigger');

      for (let i = 0; i < 3; i++) {
        const bullet: HTMLElement = document.createElement('div');
        bullet.classList.add('navTrigger');
        navToggle.appendChild(bullet);
      }

      return navToggle;
    },

    buildForm: (htmlForm: string): HTMLElement => {
      const form: HTMLFormElement = document.createElement('form');
      form.id = 'formulaire';

      form.innerHTML = htmlForm;
      form.method = 'POST';
      // form.action = 'https://lidobix.alwaysdata.net/portfolio/contact';
      const formContainer: HTMLElement = document.createElement('div');
      formContainer.classList.add('formContainer');

      formContainer.appendChild(form);
      return formContainer;
    },

    buildProjects: (projects: Project[], levelUp: Site): HTMLElement => {
      const container: HTMLDivElement = document.createElement('div');
      container.id = 'projectList';
      projects.forEach((project) => {
        if (project.display) {
          const card: HTMLDivElement = document.createElement('div');
          card.classList.add('card');

          if (project.image) {
            const figure: HTMLElement = document.createElement('figure');

            const view: HTMLImageElement = document.createElement('img');

            view.src = project.image;
            figure.appendChild(view);

            card.appendChild(figure);
          }
          const description: HTMLDivElement = document.createElement('div');
          description.classList.add('cardDescription');

          const projectTitle: HTMLHeadElement = document.createElement('h4');
          projectTitle.innerText = `${project.title}`;

          description.appendChild(projectTitle);

          const type: HTMLParagraphElement = document.createElement('p');
          type.innerText = `${project.type}`;
          description.appendChild(type);

          const aHref: HTMLAnchorElement = document.createElement('a');
          aHref.innerText = 'Visiter';
          aHref.id = 'projectLink';
          description.appendChild(aHref);
          if (project.link) {
            aHref.href = project.link;
            aHref.classList.add('enabledLink');
          } else {
            aHref.classList.add('disabledLink');
          }

          const summary: HTMLParagraphElement = document.createElement('p');
          summary.innerText = `${project.description}`;
          description.appendChild(summary);

          if (project.technos?.length) {
            const technoListContainer: HTMLDivElement =
              document.createElement('div');
            technoListContainer.classList.add('technoListContainer');
            const technoList: HTMLDivElement = document.createElement('div');
            technoList.classList.add('technoList');
            project.technos?.forEach((techno) => {
              const logo: HTMLImageElement = document.createElement('img');

              logo.src = `assets/images/${techno.toLowerCase()}.png`;

              technoList.appendChild(logo);
            });
            technoListContainer.appendChild(technoList);
            description.appendChild(technoListContainer);
            card.appendChild(description);
          }

          levelUp.buildCardEvents(card, project, levelUp);

          container.appendChild(card);
        }
      });
      return container;
    },

    buildCardEvents: (
      card: HTMLDivElement,
      project: Project,
      levelUp: Site
    ) => {
      card.addEventListener('click', (e) => {
        const targetEvent: HTMLElement = e.target as HTMLElement;
        if (!targetEvent.classList.contains('enabledLink')) {
          this.setTimeout(() => {
            levelUp.projectPreview = true;
          }, 300);
          const previewBackground: HTMLDivElement =
            document.createElement('div');

          previewBackground.id = 'preview';
          previewBackground.classList.add('previewBackground');
          previewBackground.style.top = window.scrollY + 'px';

          previewBackground.style.height = window.innerHeight + 'px';
          levelUp.previewBackgroundDiv = previewBackground;

          const bodyStyle: CSSStyleDeclaration = window.getComputedStyle(
            levelUp.body
          );

          const scrollBarWidth: number =
            this.window.innerWidth - parseInt(bodyStyle.width);

          levelUp.sectionPaddingRight = parseInt(
            this.window.getComputedStyle(document.querySelector('section')!)
              .paddingRight
          );

          levelUp.headerPaddingRight = parseInt(
            this.window.getComputedStyle(document.querySelector('header')!)
              .paddingRight
          );
          levelUp.navToggleRight = parseInt(
            this.window.getComputedStyle(document.getElementById('navToggle')!)
              .right
          );

          levelUp.section.style.paddingRight =
            levelUp.sectionPaddingRight + scrollBarWidth + 'px';

          levelUp.header.style.paddingRight =
            levelUp.headerPaddingRight + scrollBarWidth + 'px';

          levelUp.navToggle.style.right =
            levelUp.navToggleRight + scrollBarWidth + 'px';

          levelUp.body.classList.add('notScrollable');

          const previewContainer: HTMLDivElement =
            document.createElement('div');
          previewContainer.classList.add('previewContainer');
          const titleContainer: HTMLDivElement = document.createElement('div');
          const title: HTMLHeadElement = document.createElement('h2');
          title.innerText = project.title;
          const summary: HTMLDivElement = document.createElement('div');

          const descriptionContainer: HTMLParagraphElement =
            document.createElement('div');
          const description: HTMLParagraphElement = document.createElement('p');
          description.innerText = project.description;
          descriptionContainer.appendChild(description);
          summary.classList.add('previewSummary');

          titleContainer.appendChild(title);
          summary.appendChild(titleContainer);
          summary.appendChild(descriptionContainer);
          const imageContainer: HTMLDivElement = document.createElement('div');
          imageContainer.classList.add('previewImage');

          imageContainer.style.backgroundImage = `url(${project.image})`;
          previewContainer.appendChild(imageContainer);
          previewContainer.appendChild(summary);

          previewBackground.appendChild(previewContainer);

          levelUp.body.appendChild(previewBackground);
        }
      });
    },

    fetchElements: (): Promise<SiteElements> => {
      return fetch('https://lidobix.alwaysdata.net/portfolio/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((result) => {
          return result.json();
        })
        .then((datas) => {
          site.siteElements = datas[0];
          return datas[0];
        });
    },
  };

  site.buildSite();
});
