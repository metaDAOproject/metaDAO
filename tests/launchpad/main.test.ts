import initializeLaunch from "./unit/initializeLaunch.test.js";
import fund from "./unit/fund.test.js";

// TODO add a many-outcome integration test
export default function suite() {
  describe("#initialize_launch", initializeLaunch);
  describe("#fund", fund);
}
