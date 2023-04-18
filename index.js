"use strict";
// import {
//   Header,
//   Site,
//   SiteElements,
//   SectionElement,
//   NavElement,
//   Project,
// } from './types';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener('DOMContentLoaded', function () {
    const site = {
        body: this.document.querySelector('body'),
        script: this.document.querySelector('script'),
        siteElements: {},
        navToggled: false,
        buildSite: function () {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                yield this.fetchElements();
                this.body.insertBefore(this.buildHeader(this.siteElements.header), this.script);
                this.body.insertBefore(this.buildSection(this, this.siteElements.section), this.script);
                this.body.insertBefore(this.buildNav(this.siteElements.nav), this.script);
                if (document.querySelector('header')) {
                    (_a = document.querySelector('header')) === null || _a === void 0 ? void 0 : _a.appendChild(this.buildNavToggle());
                }
                const nav = document.querySelector('nav');
                const h2 = document.querySelector('h2');
                const headerStyle = window.getComputedStyle(document.querySelector('header'));
                h2.addEventListener('animationstart', () => {
                    console.log('top');
                    nav.style.top =
                        parseFloat(headerStyle.height) +
                            parseFloat(headerStyle.marginBottom) +
                            parseFloat(headerStyle.marginTop) +
                            parseFloat(headerStyle.paddingBottom) +
                            parseFloat(headerStyle.paddingTop) +
                            'px';
                });
                document.addEventListener('scroll', () => {
                    const ypos = window.scrollY;
                    const h2 = document.querySelector('h2');
                    // const nav: HTMLElement = document.querySelector('nav')!;
                    // const headerStyle = window.getComputedStyle(
                    //   document.querySelector('header')!
                    // );
                    if (ypos > 100) {
                        h2.style.fontSize = '0.9em';
                        // nav.style.top =
                        //   parseFloat(headerStyle.height) +
                        //   parseFloat(headerStyle.marginBottom) +
                        //   parseFloat(headerStyle.marginTop) +
                        //   parseFloat(headerStyle.paddingBottom) +
                        //   parseFloat(headerStyle.paddingTop) +
                        // ('px');
                    }
                    else {
                        h2.style.fontSize = '1.4em';
                        // nav.style.top =
                        //   parseFloat(headerStyle.height) +
                        //   parseFloat(headerStyle.marginBottom) +
                        //   parseFloat(headerStyle.marginTop) +
                        //   parseFloat(headerStyle.paddingBottom) +
                        //   parseFloat(headerStyle.paddingTop) +
                        //   'px';
                    }
                    console.log(`header height: ${parseFloat(headerStyle.height) +
                        parseFloat(headerStyle.marginBottom) +
                        parseFloat(headerStyle.marginTop) +
                        parseFloat(headerStyle.paddingBottom) +
                        parseFloat(headerStyle.paddingTop) +
                        'px'}, nav top: `);
                });
                document.addEventListener('click', (e) => {
                    const nav = document.querySelector('nav');
                    const targetEvent = e.target;
                    if (targetEvent.classList.contains('navToggle') && !this.navToggled) {
                        this.navToggled = true;
                        nav.style.display = 'block';
                    }
                    else {
                        this.navToggled = false;
                        nav.style.display = 'none';
                    }
                });
            });
        },
        buildHeader: (headerElements) => {
            const header = document.createElement('header');
            const pageTitle = document.createElement('h1');
            pageTitle.innerText = headerElements.title;
            const subTitle = document.createElement('h2');
            subTitle.innerText = headerElements.subtitle;
            header.appendChild(pageTitle);
            header.appendChild(subTitle);
            return header;
        },
        buildSection: (levelUp, sectionElements) => {
            const section = document.createElement('section');
            sectionElements.forEach((sectionElement) => {
                if (sectionElement.display) {
                    const title = document.createElement('h3');
                    title.innerText = sectionElement.name;
                    const anchorCalc = sectionElement.name
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
                        const content = document.createElement('p');
                        content.innerText = sectionElement.text;
                        section.appendChild(content);
                    }
                    if (sectionElement.projectList) {
                        section.appendChild(levelUp.buildProjects(sectionElement.projectList));
                    }
                    if (sectionElement.htmlForm) {
                        section.appendChild(levelUp.buildForm(sectionElement.htmlForm));
                    }
                }
            });
            return section;
        },
        buildNav: (navElements) => {
            const ul = document.createElement('ul');
            const nav = document.createElement('nav');
            navElements.forEach((element) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = element.anchor;
                a.innerText = element.name;
                li.appendChild(a);
                ul.appendChild(li);
                nav.appendChild(ul);
            });
            return nav;
        },
        buildNavToggle: () => {
            const navToggle = document.createElement('div');
            const nav = document.querySelector('nav');
            navToggle.classList.add('navToggle');
            navToggle.addEventListener('click', (e) => {
                // const targetEvent: HTMLElement = e.target as HTMLElement;
                // if (targetEvent.classList.contains('navToggle')) {
                // }
                // if (!site.navToggled) {
                //   site.navToggled = true;
                //   nav.style.display = 'block';
                // }
                // nav.style.display === 'none' || nav.style.display === ''
                //   ? (nav.style.display = 'block')
                //   : (nav.style.display = 'none');
            });
            for (let i = 0; i < 3; i++) {
                const bullet = document.createElement('div');
                bullet.classList.add('navToggle');
                navToggle.appendChild(bullet);
            }
            return navToggle;
        },
        buildForm: (htmlForm) => {
            const form = document.createElement('form');
            form.classList.add('card');
            form.innerHTML = htmlForm;
            form.method = 'POST';
            return form;
        },
        buildProjects: (projects) => {
            const container = document.createElement('div');
            container.id = 'projectList';
            projects.forEach((project) => {
                var _a, _b;
                if (project.display) {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    if (project.image) {
                        const figure = document.createElement('figure');
                        // figure.style = `url(${project.image})`;
                        const view = document.createElement('img');
                        // view.classList.add('projectView');
                        view.src = project.image;
                        figure.appendChild(view);
                        // card.appendChild(view);
                        card.appendChild(figure);
                    }
                    const description = document.createElement('div');
                    description.classList.add('cardDescription');
                    // const titleContainer: HTMLElement = document.createElement('div');
                    // titleContainer.classList.add('projectTitleContainer');
                    const projectTitle = document.createElement('h4');
                    projectTitle.innerText = `${project.title}`;
                    // titleContainer.appendChild(projectTitle);
                    description.appendChild(projectTitle);
                    // card.appendChild(titleContainer);
                    // const quickDescription: HTMLDivElement =
                    //   document.createElement('div');
                    // quickDescription.classList.add('quickDescription');
                    const type = document.createElement('p');
                    type.innerText = `${project.type}`;
                    description.appendChild(type);
                    // quickDescription.appendChild(type);
                    // const detail: HTMLParagraphElement = document.createElement('p');
                    // detail.innerText = `${project.description}`;
                    // quickDescription.appendChild(status);
                    // description.appendChild(detail);
                    // quickDescription.appendChild(status);
                    // card.appendChild(quickDescription);
                    // card.appendChild(description);
                    if ((_a = project.technos) === null || _a === void 0 ? void 0 : _a.length) {
                        const technoList = document.createElement('div');
                        technoList.classList.add('technoList');
                        (_b = project.technos) === null || _b === void 0 ? void 0 : _b.forEach((techno) => {
                            const div = document.createElement('div');
                            const logo = document.createElement('img');
                            div.classList.add('logoTechno');
                            logo.src = `assets/images/${techno.toLowerCase()}.png`;
                            div.appendChild(logo);
                            technoList.appendChild(div);
                        });
                        description.appendChild(technoList);
                        card.appendChild(description);
                    }
                    if (project.link) {
                        card.addEventListener('click', (e) => {
                            console.log(project.link);
                            window.location.href = project.link;
                        });
                    }
                    container.appendChild(card);
                }
            });
            return container;
        },
        fetchElements: () => {
            // return fetch(`http://127.0.0.1:3000/portfolio/home`, {
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