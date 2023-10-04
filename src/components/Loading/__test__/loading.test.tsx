import { screen, render } from "@testing-library/react";

import Loading from "../loading"


describe("<Loading />", () => {
    it("Matches snapshot", () => {
        render(
            <Loading display />
        );

        // Use screen.queryByTestId method
        const loadingElement = screen.queryByTestId("loading-element");
        
        // Expectations
        expect(loadingElement).toMatchSnapshot();
    });

    it("Not visible when false display prop", () => {
        render(
            <Loading />
        );

        // Use screen.queryByTestId method
        const loadingElement = screen.queryByTestId("loading-element");
        
        // Expectations
        expect(loadingElement).toHaveClass("loading--hidden");
    });
});