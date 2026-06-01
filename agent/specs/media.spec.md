# Media Spec

This spec defines images, logos, banners, and uploaded media handling.

## Scope

- product images;
- stock images;
- complement images;
- store logo and banner;
- favicon and PWA icons;
- uploaded media storage paths.

## Rules

- uploads must store file paths rather than binary blobs in the database;
- media storage should use a predictable directory layout;
- default assets must be used when no custom asset exists;
- media should be available to the storefront and admin views.

## Related

- [media.stat](media.stat.md)
- [settings.spec](settings.spec.md)
- [pwa.spec](pwa.spec.md)
