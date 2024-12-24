"use client";
import { AppProgressBar, ProgressBarProps } from "next-nprogress-bar";

interface ProgressLoadingAtomProps extends ProgressBarProps {
  children?: React.ReactNode;
}

/**
 * A component to show a progress bar on top of the page while a next.js page is loading.
 * This component is used in the root layout to wrap the entire app, so that the progress bar
 * is displayed on each page transition.
 *
 * @param {React.ReactNode} [children] The children to be rendered.
 * @param {ProgressBarProps} [props] Props to be passed to the underlying AppProgressBar component.
 * @returns {JSX.Element} The progress bar component.
 */
export function ProgressLoadingAtom({ children, ...props }: Readonly<ProgressLoadingAtomProps>) {
  return (
    <>
      {children}
      <AppProgressBar height="4px" color="var(--primary)" options={{ showSpinner: false }} shallowRouting {...props} />
    </>
  );
}
