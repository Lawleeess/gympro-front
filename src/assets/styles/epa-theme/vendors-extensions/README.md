# Vendors extensions

Most projects will have a `vendors/` folder containing all the CSS files from external libraries and frameworks – Angular Material UI component in this case.

If you have to override a section of any vendor, I recommend you have an 8th folder called `vendors-extensions/` in which you may have files named exactly after the vendors they overwrite. For instance, `vendors-extensions/_angular-material.scss` is a file containing all CSS rules intended to re-declare some of Bootstrap’s default CSS. This is to avoid editing the vendor files themselves, which is generally not a good idea.

Reference: [Sass Guidelines](https://sass-guidelin.es/) > [Architecture](https://sass-guidelin.es/#architecture) > [Vendors folder](https://sass-guidelin.es/#vendors-folder)
