/** Organizer class for user input and applying it against the magpie. */
class Inputs {
  /** Forward thrust, in pixels per second, per second. */
  static THRUST = 180;
  /** Reverse thrust is weaker than forward thrust. */
  static REVERSE_THRUST = 90;
  /** Turning speed, in radians per second. */
  static TURN_RATE = 1.8;

  magpie;

  constructor(magpie) {
    this.magpie = magpie;
  }

  /**
   * WASD for movement, space for tractor beam. `delta` is the ms since the last
   * frame, so holding a key has the same effect at any frame rate.
   **/
  handleKeyDown(delta) {
    if (keyIsDown("w")) {
      this.magpie.physics.thrust(Inputs.THRUST, delta);
    }

    if (keyIsDown("s")) {
      this.magpie.physics.thrust(-Inputs.REVERSE_THRUST, delta);
    }

    if (keyIsDown("a")) {
      this.magpie.physics.rotate(-Inputs.TURN_RATE, delta);
    }

    if (keyIsDown("d")) {
      this.magpie.physics.rotate(Inputs.TURN_RATE, delta);
    }

    if (keyIsDown("Space")) {
      this.magpie.enableBeam(true);
    } else {
      this.magpie.enableBeam(false);
    }
  }
}
/**
 * Keys whose browser default is to scroll the page (or a parent page) in
 * case this is inside an iframe.
 **/
const SCROLL_KEYS = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/**
 * Handles one-shot key presses (not held keys). Toggles debug mode with ~ or
 * backtick. Returning false for scroll keys keeps them from scrolling the
 * page; other keys (like Cmd-R) keep their normal browser behavior.
 */
function keyPressed() {
  // game is undefined until setup() runs
  if (game && (key === "~" || key === "`")) {
    game.debug = !game.debug;
  }
  if (SCROLL_KEYS.includes(key)) {
    return false;
  }
}
