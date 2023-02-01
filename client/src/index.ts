window.addEventListener('DOMContentLoaded', function () {
  console.log('JS lancé');

  const script: HTMLScriptElement | null = document.querySelector('script');

  const body: HTMLBodyElement | null = document.querySelector('body');

  type ProjectSubtype = 'Projet perso' | "projet d'études";

  type Header = {
    title: string;
    subtitle: string;
  };
  type Nav = { title: string };
  type SiteElements = {
    header: Header;
    section: Section[];
    nav: Nav;
  };

  type Section = {
    id: number;
    name: string;
    type: 'text' | 'projectList' | 'contactForm';
    text?: string;
    projectList?: Project[];
  };

  type Status = 'Fini' | 'En cours' | 'Stand-By';
  type Techno =
    | 'HTML'
    | 'CSS'
    | 'JavaScript'
    | 'TypeScript'
    | 'WebSocket'
    | 'Angular'
    | 'React'
    | 'NODE_JS';

  type Project = {
    id: number;
    title: string;
    type: 'project';
    subtype: ProjectSubtype;
    status: Status;
    description: string;
    technos?: Techno[];
    image?: string;
    link?: string;
  };
  console.log('lancement fetch');

  ///////////// COUCOU SERVEUR /////////////////////////
  fetch(`http://127.0.0.1:1234/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((r) => {
      return r.json();
    })
    .then((r) => {
      console.log(r);
    });
  ///////////////////////////////////////////

  function buildPage(siteElements: SiteElements): void {
    body?.insertBefore(buildHeader(siteElements.header), script);

    body?.insertBefore(buildSection(siteElements.section), script);
  }

  function buildHeader(headerElements: Header): HTMLElement {
    const header: HTMLElement = document.createElement('header');

    const pageTitle: HTMLHeadingElement = document.createElement('h1');
    pageTitle.innerText = headerElements.title;
    const subTitle: HTMLHeadingElement = document.createElement('h2');
    subTitle.innerText = headerElements.subtitle;

    header.appendChild(pageTitle);
    header.appendChild(subTitle);

    return header;
  }

  function buildSection(sectionElements: Section[]): HTMLElement {
    const section: HTMLElement = document.createElement('section');

    sectionElements.forEach((sectionElement) => {
      const title: HTMLHeadingElement = document.createElement('h3');
      title.innerText = sectionElement.name;
      section.appendChild(title);

      if (sectionElement.text) {
        const content: HTMLParagraphElement = document.createElement('p');
        content.innerText = sectionElement.text;
        section.appendChild(content);
      }

      if (sectionElement.projectList) {
        section.appendChild(buildProjects(sectionElement.projectList));
      }
    });

    return section;
  }

  function buildProjects(projects: Project[]): HTMLElement {
    const container: HTMLDivElement = document.createElement('div');
    projects.forEach((project) => {
      const card: HTMLDivElement = document.createElement('div');

      const projectTitle: HTMLHeadElement = document.createElement('h3');
      projectTitle.innerText = `${project.title}`;
      card.appendChild(projectTitle);

      const status: HTMLParagraphElement = document.createElement('p');
      status.innerText = `${project.subtype} - ${project.status}`;
      card.appendChild(status);

      const description: HTMLParagraphElement = document.createElement('p');
      description.innerText = `${project.description}`;
      card.appendChild(description);

      const view: HTMLImageElement = document.createElement('img');
      view.classList.add('view');
      view.src = 'assets/screen.png';
      card.appendChild(view);

      if (project.technos?.length) {
        const technoList: HTMLDivElement = document.createElement('div');
        project.technos?.forEach((techno) => {
          const logo: HTMLImageElement = document.createElement('img');
          logo.classList.add('logoTechno');
          logo.src = `assets/images/${techno.toLowerCase()}.png`;
          technoList.appendChild(logo);
        });
        card.appendChild(technoList);
      }
      container.appendChild(card);
    });
    return container;
  }

  const callSiteContent = async (): Promise<void> => {
    fetch(`http://127.0.0.1:1234/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((datas) => {
        buildPage(datas[0]);
      });
  };

  callSiteContent();
});
