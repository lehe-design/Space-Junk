class Magpie {
  static DOME_WIDTH = 20;
  static DOME_HEIGHT = 30;
  static PLATFORM_WIDTH = Magpie.DOME_WIDTH + 6;
  static PLATFORM_HEIGHT = 3;
  static BEAM_WIDTH = 50;
  static BEAM_HEIGHT = 60;
  static WINDOW_WIDTH = Magpie.DOME_WIDTH / 4;
  static WINDOW_HEIGHT = Magpie.DOME_HEIGHT / 4;
  /** Where captured junk sits, in the Magpie's own frame (below the ship). */
  static CARGO_Y = 40;

  physics;
  beam;

  /** If we've caught space junk, use a direct reference to draw it. */
  capturedJunk;

  constructor() {
    this.physics = new Physics();
    this.beam = false;
    this.capturedJunk = null; // intentionally empty
  }

  draw() {
    push();
    drawEverywhere({
      offset: this.physics,
      drawFn: () => {
        // TODO (Phase 4): If this.capturedJunk isn't null, draw it here, so
        // the ship is drawn on top of it. Rotate by the Magpie's rotation,
        // translate to (0, Magpie.CARGO_Y), and call Junk.drawJunk(). Use
        // push() and pop() so the ship below isn't moved too.
        Magpie.drawMagpie({ rotation: this.physics.rotation, beam: this.beam });
        if (game.debug) {
          this.physics.draw();
        }
      },
    });
    pop();
  }

  /** Sets the captured junk to the given one, and turns off the beam. */
  captureJunk(junk) {
    // TODO (Phase 4): Remember the junk in this.capturedJunk, and switch the
    // beam off.
  }

  // this method is static. That means it doesn't use `this` to gain access to
  // instance members, because there _is_ no instance. This is essentially a
  // function that happens to be placed inside the Magpie namespace.
 static drawMagpie({ rotation, beam }) {
  push();
  rotate(rotation);
  rectMode(CENTER);
  noStroke();
   // Transparent yellow beam, drawn behind the ship
    if (beam) {
      fill("#FFE6A740");
      triangle(
        0, 0,
        Magpie.BEAM_WIDTH / 2, Magpie.BEAM_HEIGHT,
        -Magpie.BEAM_WIDTH / 2, Magpie.BEAM_HEIGHT
      );
    }

  // Coral dome, centered at the ship's origin
  fill("#F28C82");
  rect(
    0,
    0,
    Magpie.DOME_WIDTH,
    Magpie.DOME_HEIGHT,
    8
  );

  // Plum platform along the dome's bottom edge
  fill("#6D4C7D");
  rect(
    0,
    Magpie.DOME_HEIGHT / 2,
    Magpie.PLATFORM_WIDTH,
    Magpie.PLATFORM_HEIGHT
  );

  // Pale yellow window on the right, just above center
  fill("#FFE6A7");
  rect(
    Magpie.DOME_WIDTH / 2 - Magpie.WINDOW_WIDTH / 2,
    -Magpie.WINDOW_HEIGHT / 2,
    Magpie.WINDOW_WIDTH,
    Magpie.WINDOW_HEIGHT
  );

  pop();
}
  move(delta) {
    this.physics.move(delta, { constrain: true });

    if (this.capturedJunk) {
      push();
      translate(this.physics.x, this.physics.y);
      rotate(this.physics.rotation);
      const cargo = worldToScreen(0, Magpie.CARGO_Y);
      pop();

      this.capturedJunk.physics.x = cargo.x;
      this.capturedJunk.physics.y = cargo.y;
    }
  }

  beamContains({ x, y }) {
    if (!this.beam) {
      return false;
    }

    let inside = false;

    drawEverywhere({
      offset: this.physics,
      drawFn: () => {
        rotate(this.physics.rotation);

        const p = screenToWorld(x, y);
        const halfWidth =
          (p.y / Magpie.BEAM_HEIGHT) * (Magpie.BEAM_WIDTH / 2);
        const withinDepth =
          p.y >= 0 && p.y <= Magpie.BEAM_HEIGHT;

        if (withinDepth && Math.abs(p.x) <= halfWidth) {
          inside = true;
        }
      },
    });

    return inside;
  }

   enableBeam(v) {
    if (!v || this.capturedJunk === null) {
      this.beam = v;
    }
  }
}