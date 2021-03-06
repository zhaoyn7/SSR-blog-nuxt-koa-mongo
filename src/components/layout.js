import React from "react"
import { Link } from "gatsby"
import Toggle from './Toggle'
import SideNav from './SideNav'
import MenuButton from './MenuButton'

import { rhythm, scale } from "../utils/typography"
import styles from './Layout.module.css'

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      theme: null,
      menuVisible: false,
      layoutWrapper: null
    };
    this.handleSideNavClick = this.handleSideNavClick.bind(this);
    this.handleMenuButtonClick = this.handleMenuButtonClick.bind(this);
  };

  componentDidMount() {
    this.setState({
      theme: window.__theme,
      layoutWrapper: document.getElementById('gatsby-focus-wrapper')
    });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
    window.addEventListener('click', () => {
      console.log('click')
      if (this.state.menuVisible) {
        let elem = this.state.layoutWrapper
        this.setState({ menuVisible: false })
        elem.style.paddingRight = '0'
      }
    })
  }

  renderHeader() {
    const { location, title } = this.props
    let header;
    const rootPath = `${__PATH_PREFIX__}/`
    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginTop: 0,
            marginBottom: 0,
            color: this.state.theme === 'dark' && '#2bb673'
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
            marginBottom: 0,
            color: this.state.theme === 'dark' && '#2bb673'
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return header
  }

  handleMenuButtonClick(event) {
    event.stopPropagation();
    let elem = this.state.layoutWrapper
    if (this.state.menuVisible) {
      this.setState({ menuVisible: false })
      elem.style.paddingRight = '0px'
    } else {
      this.setState({ menuVisible: true })
      elem.style.paddingRight = '300px'
    }
  }
  
  handleSideNavClick() {
    this.setState({ menuVisible: false })
    let elem =  this.state.layoutWrapper
    elem.style.paddingRight = '0'
  }

  render() {
    const { children } = this.props
    return (
      <div
        className={`${styles.layout}`}
        style={{
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {/* <SideNav onClick={this.handleSideNavClick} menuVisible={this.state.menuVisible} /> */}
        <header
          style={{
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: rhythm(1.5),
          }}
        >
          {this.renderHeader()}
          <div style={{ display: 'flex', alignItems: 'center'}}>
            {this.state.theme === null ? (
              <div style={{ height: '24px' }}></div>
            ) : (
                <Toggle
                  checked={this.state.theme === 'dark'}
                  onChange={e =>
                    window.__setPreferredTheme(
                      e.target.checked ? 'dark' : 'light'
                    )
                  }
                />
              )}
            {/* {<MenuButton onClick={this.handleMenuButtonClick} />} */}
          </div>
        </header>
        <main>{children}</main>
        <footer>
          Made by <a href="/">Yinan Zhao</a> | KuHe.run ️© {new Date().getFullYear()}
        </footer>
      </div>
    )
  }
}

export default Layout
