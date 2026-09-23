// Filename: lugar-seguro.js
// Lightbox for the mural photographs.
//
// Same library and version as the product pages, loaded the same way: nothing
// is fetched until the first click, so a visitor who only reads the page never
// pays for it. Unlike the product gallery, which needs a hidden #pswp-gallery
// because its visible element is one image that swaps source, each mural is
// already its own anchor — PhotoSwipe reads those directly.

'use strict';

let lightbox = null;

async function open(index) {
    if (!lightbox) {
        const { default: PhotoSwipeLightbox } = await import(
            'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.js'
        );
        lightbox = new PhotoSwipeLightbox({
            gallery: '.ls-murals-grid',
            children: 'a.ls-mural-card__zoom',
            pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.js'),
        });

        // PhotoSwipe 5 ships a counter but no caption. Zoomed into a corner of
        // a wall you lose track of which room you are in, so the room name
        // rides along — at the bottom, clear of the counter and controls that
        // occupy the top bar.
        lightbox.on('uiRegister', () => {
            lightbox.pswp.ui.registerElement({
                name: 'lsCaption',
                order: 9,
                isButton: false,
                appendTo: 'root',
                onInit: (el, pswp) => {
                    // classList.add, not className — overwriting would strip the
                    // classes PhotoSwipe puts there itself. The name is ours so
                    // the library has no rule of its own competing with it.
                    el.classList.add('ls-pswp-caption');

                    const render = () => {
                        const a = pswp.currSlide?.data?.element;
                        el.textContent = a?.dataset.pswpCaption ?? '';
                    };
                    pswp.on('change', render);
                    render();   // the first slide fires no change event
                },
            });
        });

        lightbox.init();
    }
    lightbox.loadAndOpen(index);
}

document.addEventListener('DOMContentLoaded', () => {
    const zooms = document.querySelectorAll('a.ls-mural-card__zoom');
    if (!zooms.length) return;

    zooms.forEach((a, i) => {
        a.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await open(i);
            } catch (err) {
                // The library comes from a CDN, so it can fail to arrive. Without
                // this the click would simply do nothing and the photograph would
                // look broken; the href is a real URL, so fall back to opening the
                // full-size image the plain way.
                console.error('Lightbox indisponível, a abrir a imagem diretamente:', err);
                window.location.href = a.href;
            }
        });
    });
});
