import { h, Component } from "preact";
import { history } from "./history";

const DEFAULT_TRANSITION_ANIMATION = "slide";

function transitionAnimationForPage(page) {
  if (page && page.attributes && page.attributes.transition) {
    return page.attributes.transition;
  }
  return DEFAULT_TRANSITION_ANIMATION;
}

class PageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.children[0]
    };
  }

  componentWillReceiveProps(props) {
    const nextPage = props.children[0];
    const previousPage = this.state.currentPage;

    if (nextPage.attributes.url !== previousPage.attributes.url) {
      this.setState({ previousPage, currentPage: nextPage });
    }
  }

  render() {
    const { previousPage, currentPage } = this.state;
    const isBack = history.action !== "PUSH";
    const animation =
      isBack && previousPage != null
        ? transitionAnimationForPage(previousPage)
        : transitionAnimationForPage(currentPage);

    const currentClassName =
      previousPage == null
        ? ""
        : `maji-page-animating maji-page-animation-${animation} maji-page-incoming${isBack
            ? " maji-page-reverse"
            : ""}`;
    const previousClassName =
      previousPage == null
        ? ""
        : `maji-page-animating maji-page-animation-${animation} maji-page-outgoing${isBack
            ? " maji-page-reverse"
            : ""}`;

    return (
      <div class="maji-page-container">
        <div class={currentClassName}>{currentPage}</div>
        <div
          class={previousClassName}
          onAnimationEnd={() => this.setState({ previousPage: null })}
        >
          {previousPage}
        </div>
      </div>
    );
  }
}

export const augmentRouter = function(RouterClass) {
  return class TransitionAwareRouter extends RouterClass {
    render(...args) {
      return <PageContainer>{super.render(...args)}</PageContainer>;
    }
  };
};
