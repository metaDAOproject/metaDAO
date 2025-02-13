import initializeLaunch from "./unit/initializeLaunch.test.js";
import fund from "./unit/fund.test.js";
import completeLaunch from "./unit/completeLaunch.test.js";
// TODO add a many-outcome integration test
export default function suite() {
  describe("#initialize_launch", initializeLaunch);
  describe("#fund", fund);
  describe("#complete_launch", completeLaunch);
}
