import React, { Component } from 'react';
import PropTypes from 'prop-types'
import countries from './countries';

class ReactFlagsSelect extends Component {
	constructor(props){
		super(props);

		let fullCountries = Object.keys(countries);

		let selectCountries = this.props.countries && this.props.countries.filter( country => {
			return countries[country] ;
		});


		//Filter BlackList
		selectCountries = !this.props.blackList ? selectCountries : fullCountries.filter(countryKey =>{
				return selectCountries.filter(country =>{
					return countryKey === country;
				}).length === 0
		});

		let defaultCountry = countries[this.props.defaultCountry] && this.props.defaultCountry;
		const countrySorted = selectCountries || fullCountries;

		if (this.props.relevantCountries) {
      countrySorted.sort(this.sortByRelevance.bind(this));
		}

		this.state = {
			openOptions: false,
      countries: countrySorted,
			defaultCountry: defaultCountry,
			filteredCountries: []
		}

		this.toggleOptions = this.toggleOptions.bind(this);
		this.closeOptions = this.closeOptions.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.filterSearch = this.filterSearch.bind(this);
	}

	toggleOptions() {
		!this.state.disabled && this.setState({
			openOptions: !this.state.openOptions
		});
	}

	closeOptions(event) {
		if (event.target !== this.refs.selectedFlag && event.target !== this.refs.flagOptions && event.target !== this.refs.filterText ) {
			this.setState({
				openOptions: false
			});
		}
	}

	onSelect(countryCode) {
		this.setState({
			selected: countryCode,
			filter : ''
		})
		this.props.onSelect && this.props.onSelect(countryCode);
	}

	updateSelected(countryCode) {
		let isValid = countries[countryCode];

		isValid && this.setState({
			selected: countryCode
		})
	}

	filterSearch(evt) {
		let filterValue = evt.target.value;
		let filteredCountries = filterValue && this.state.countries.filter(key => {
			let label = this.props.customLabels[key] || countries[key];
			return  label && label.match(new RegExp(filterValue, 'i'))
		}) ;

		if (filteredCountries && this.props.relevantCountries) {
      filteredCountries.sort(this.sortByRelevance.bind(this));
    }

		this.setState({filter : filterValue, filteredCountries : filteredCountries });
	}

  sortByRelevance(countryCodeFirst, countryCodeSecond) {
    let result = 0;
    const isFirstRelevant = this.props.relevantCountries.indexOf(countryCodeFirst) >= 0;
    const isSecondRelevant = this.props.relevantCountries.indexOf(countryCodeSecond) >= 0;

    if (isFirstRelevant && !isSecondRelevant) {
      result = -1;
    } else if (isSecondRelevant && !isFirstRelevant) {
      result = 1;
    }

    return result;
  }

  	componentDidMount() {
		!this.props.disabled && window.addEventListener("click", this.closeOptions);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selected) {
			this.updateSelected(nextProps.selected);
		}
	}

	componentWillUnmount() {
		!this.props.disabled && window.removeEventListener("click", this.closeOptions);
	}

	render() {

		let isSelected = this.state.selected || this.state.defaultCountry;
		let selectedSize = this.props.selectedSize;
		let optionsSize = this.props.optionsSize;
		let alignClass = this.props.alignOptions.toLowerCase() === 'left' ? 'to--left' : '';

		return (
			<div className={`flag-select ${this.props.className ? this.props.className :  ""}`}>
				<div ref="selectedFlag" style={{fontSize: `${selectedSize}px`}} className={`selected--flag--option ${this.props.disabled ? 'no--focus' : ''}`} onClick={this.toggleOptions}>
					{isSelected &&
						<span className="country-flag" style={{width: `${selectedSize}px`, height: `${selectedSize}px`}} >
							<img src={require(`../flags/${isSelected.toLowerCase()}.svg`)} />
							{this.props.showSelectedLabel &&
								<span className="country-label">{ this.props.customLabels[isSelected] || countries[isSelected] }</span>
							}
						</span>
					}

					{!isSelected &&
						<span className="country-label">{this.props.placeholder}</span>
					}
					<span className={`arrow-down ${this.props.disabled ? 'hidden' : ''}`}>▾</span>
				</div>

				{this.state.openOptions &&
					<div ref="flagOptions" style={{fontSize: `${optionsSize}px`}} className={`flag-options ${alignClass}`}>
						{this.props.searchable &&
							<div className="filterBox">
								<input type="text" placeholder="Search" ref="filterText"  onChange={this.filterSearch}/>
							</div>
						}
						{(this.state.filter ? this.state.filteredCountries : this.state.countries)
							.slice(0, this.props.displayingLimit)
							.map( countryCode =>
								<div className={`flag-option ${this.props.showOptionLabel ? 'has-label' : ''}`} key={countryCode} onClick={() => this.onSelect(countryCode)}>
									<span className="country-flag" style={{width: `${optionsSize}px`, height: `${optionsSize}px`}} >
										<img src={require(`../flags/${countryCode.toLowerCase()}.svg`)} />
										{this.props.showOptionLabel &&
											<span className="country-label">{ this.props.customLabels[countryCode] || countries[countryCode] }</span>
										}
									</span>
								</div>
						)}
					</div>
				}
			</div>
		)
	}
}

ReactFlagsSelect.defaultProps = {
	selectedSize: 16,
	optionsSize: 14,
	placeholder: "Select a country",
	showSelectedLabel: true,
	showOptionLabel: true,
	alignOptions: "right",
	customLabels: [],
	disabled: false,
	blackList: false,
	searchable: false
}

ReactFlagsSelect.propsType = {
	countries: PropTypes.array,
	blackList: PropTypes.bool,
	customLabels: PropTypes.array,
	selectedSize: PropTypes.number,
	optionsSize: PropTypes.number,
	defaultCountry: PropTypes.string,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	showSelectedLabel: PropTypes.bool,
	showOptionLabel: PropTypes.bool,
	alignOptions: PropTypes.string,
	onSelect: PropTypes.func,
	disabled: PropTypes.bool,
	searchable: PropTypes.bool,
	displayingLimit: PropTypes.number,
	relevantCountries: PropTypes.arrayOf(PropTypes.string),
	selected: PropTypes.string
}

export default ReactFlagsSelect;
