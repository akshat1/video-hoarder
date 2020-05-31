import { getTheme } from "../theme";
import { isSubmitDisabled,LoginForm } from "./LoginForm.jsx";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/DeleteConfirmationDialog", () => {
  test("DeleteConfirmationDialog matches snapshot", () => {
    expect(
      shallow(
        <ThemeProvider theme={getTheme()}>
          <LoginForm />
        </ThemeProvider>
      )
    ).toMatchSnapshot();

    expect(
      shallow(
        <ThemeProvider theme={getTheme()}>
          <LoginForm fetchingUser/>
        </ThemeProvider>
      )
    ).toMatchSnapshot();

    expect(
      shallow(
        <ThemeProvider theme={getTheme()}>
          <LoginForm loggedIn/>
        </ThemeProvider>
      )
    ).toMatchSnapshot();

    expect(
      shallow(
        <ThemeProvider theme={getTheme()}>
          <LoginForm loginError="Omlette du Fromage'"/>
        </ThemeProvider>
      )
    ).toMatchSnapshot();
  });

  describe("isSubmitDisabled", () => {
  test("returns true when no userName", () => {
      const args = {
        password: "password",
        fetchingUser: false,
        loggedIn: false,
      };

      expect(isSubmitDisabled({
        ...args
      })).toBeTruthy();

      expect(isSubmitDisabled({
        ...args,
        username: "",
      })).toBeTruthy();

      expect(isSubmitDisabled({
        ...args,
        username: null,
      })).toBeTruthy();
    });

  test("returns true when no password", () => {
      const args = {
        userName: "user",
        fetchingUser: false,
        loggedIn: false,
      };

      expect(isSubmitDisabled({
        ...args
      })).toBeTruthy();

      expect(isSubmitDisabled({
        ...args,
        password: "",
      })).toBeTruthy();

      expect(isSubmitDisabled({
        ...args,
        password: null,
      })).toBeTruthy();
    });

  test("returns true when fetchingUSer", () => {
      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
        fetchingUser: true,
      })).toBeTruthy();
    });

  test("returns true when loggedIn", () => {
      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
        loggedIn: true,
      })).toBeTruthy();
    });

  test("returns false when everything is just so", () => {
      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
      })).toBeFalsy();

      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
        isFetchingUser: false,
      })).toBeFalsy();

      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
        isFetchingUser: false,
        isLoggedIn: false,
      })).toBeFalsy();

      expect(isSubmitDisabled({
        userName: "userName",
        password: "password",
        isLoggedIn: false,
      })).toBeFalsy();
    });
  });
});
