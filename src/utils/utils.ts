export function createResponsiveBackground(spriteName: string) {
  getSprite(spriteName).then((backgroundSprite) => {
    if (backgroundSprite) {
      const scaleX = width() / backgroundSprite.width;
      const scaleY = height() / backgroundSprite.height;
      const backgroundScale = Math.max(scaleX, scaleY);
      add([
        sprite(spriteName),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(backgroundScale),
        z(0),
      ]);
    }
  });
}
