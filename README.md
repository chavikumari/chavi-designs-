# Chavi Designs

Static portfolio website. Serve the dist directory with any static server.

## GitHub Pages

The included GitHub Actions workflow publishes `dist/` when changes are pushed to `main`. Set the repository's Pages publishing source to **GitHub Actions**. `scripts/prepare_pages.py` adjusts local asset and page URLs for the repository's Pages subpath without changing the original files in `dist/`.

To preview locally, run `python3 -m http.server 4173 --directory dist` and visit `http://127.0.0.1:4173/`.

Pages: Home, Work, About, Services, six individual case studies, and 404.

Artwork, studio copy and service information are based on the supplied Chavi Designs portfolio and service guide. Foxy is a client project; Act II is a concept project. The six project galleries contain 70 original project images, with a full-size viewer.

The founder is Chavi. Ranchers headlines, Poppins body text and Pixelify Sans highlights are served locally. The scrapbook layout uses the original pink and purple palette, with blue, yellow and brown accents, framed portraits and a fluffy studio logo. All six client testimonials appear at the end of the home page; personal studio notes appear on About.

Enquiries: https://tally.so/r/wMrzQ8

Games: six matching pairs featuring project artwork, odd-shade challenge, and a local drawing canvas with undo and PNG export. No visitor submissions or server storage. A motion toggle and reduced-motion support control decorative animation.

The Home-only interactive desk has a laptop folder that opens six project links and a scrapbook that opens four service pages. Both dialogs support keyboard navigation, Escape and focus restoration. The separate Work and Services pages retain their full browsing layouts. About includes the founder's stated 45+ clients worldwide and interactive personal facts.
