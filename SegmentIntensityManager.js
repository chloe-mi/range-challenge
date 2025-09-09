/**
 * Manages intensities for segments on a number line.
 */
class SegmentIntensityManager {
  /**
   * Stores pairs of [point, intensity starting at that point].
   * Entries ordered by start point (maintained via insertion).
   * Initially there are no segment points, and the entire number line has intensity 0.
   */
  _startToIntensity = [];

  /**
   * @returns deep copy of number line,
   *  represented by pairs of [point, intensity starting at that point].
   */
  getNumberLine() {
    return structuredClone(this._startToIntensity);
  }

  /**
   * Adds `amount` of intensity to the segment [`from`, `to`).
   * @param {number} from - start point, inclusive.
   * @param {number} to - end point, exclusive.
   * @param {bigint} amount - intensity to add to the segment.
   */
  add(from, to, amount) {
    if (from >= to) return;  // invalid segment
    this._apply(from, to, intensity => intensity + amount);
  }

  /**
   * Sets the intensity for the segment [`from`, `to`) to `amount`.
   * @param {number} from - start point, inclusive.
   * @param {number} to - end point, exclusive.
   * @param {bigint} amount - intensity to set the segment to.
   */
  set(from, to, amount) {
    if (from >= to) return;  // invalid segment
    this._apply(from, to, () => amount);
  }

  /**
   * Applies an operation across the segment [`from`, `to`).
   * @param {number} from - start point, inclusive.
   * @param {number} to - end point, exclusive.
   * @param {function(number):number} op - returns new intensity. 
   */
  _apply(from, to, op) {
    // insert points if they don't already exist
    this._insertPoint(from);
    this._insertPoint(to);

    for (let i = 0; i < this._startToIntensity.length; i++) {
      const [start, intensity] = this._startToIntensity[i];
      if (start >= from && start < to) this._startToIntensity[i][1] = op(intensity);
      else if (start >= to) break;
    }

    this._fuse();
  }

  /**
   * Inserts `point` into number line.
   * If point is less than all existing points, is paired with intensity 0.
   * Otherwise, is paired with previous point's intensity.
   * @param {number} point - to insert.
   */
  _insertPoint(point) {
    // find right index
    let i = 0;
    while (i < this._startToIntensity.length && this._startToIntensity[i][0] < point) {
      i++;
    }

    // point already exists
    if (i < this._startToIntensity.length && this._startToIntensity[i][0] === point) {
      return;
    }

    // determine intensity
    const prevIntensity = i === 0 ? 0 : this._startToIntensity[i - 1][1];
    this._startToIntensity.splice(i, 0, [point, prevIntensity]);
  }

  /**
   * Fuses adjacent segments with the same intensity into 1.
   * Keeps internal list of segments clean and minimal :)
   */
  _fuse() {
    const fused = [];
    for (const [start, intensity] of this._startToIntensity) {
      if (fused.length === 0 && intensity !== 0  // first non-0 point
          || fused.length !== 0 && fused[fused.length - 1][1] !== intensity) {  // dif intensity that prev
        fused.push([start, intensity]);
      }
    }
    this._startToIntensity = fused;
  }
}

module.exports = SegmentIntensityManager;