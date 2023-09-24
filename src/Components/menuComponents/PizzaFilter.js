import React from 'react';
import { Form, Overlay } from 'react-bootstrap';

const PizzaFilter = ({
  ulubioneChecked,
  setUlubioneChecked,
  ulubioneTooltipVisible,
  setUlubioneTooltipVisible,
  ulubioneSkladniki,
  nieUlubioneChecked,
  setNieUlubioneChecked,
  nieUlubioneTooltipVisible,
  setNieUlubioneTooltipVisible,
  nieUlubioneSkladniki,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="d-flex justify-content-center col-12 col-md-3">
      <div className="col-11 col-md-11 border" style={{ responsive: "true", marginTop: "40px", height: "454px", marginLeft: "0px", background: '#222', padding: '20px' }}>
        <Form>
          <fieldset>
            <legend className="mt-2" style={{ fontWeight: "bold", fontSize: "18px" }}>Wybierz Opcje Filtrowania</legend>
            <div className="ms-4 mt-5 mb-4 d-flex" style={{ color: "white", fontWeight: "bold" }}>Opcje:</div>
            <div className="d-flex flex-column">
              <div
                className="d-flex text-left me-2"
                onMouseEnter={() => setUlubioneTooltipVisible(true)}
                onMouseLeave={() => setUlubioneTooltipVisible(false)}
              >
                <div className="ms-3 d-flex" id="ulubione">
                  <Form.Check
                    type="switch"
                    label={`Moje ulubione składniki`}
                    onChange={(event) => setUlubioneChecked(event.target.checked)}
                    checked={ulubioneChecked}
                  />
                </div>
              </div>
              <Overlay target={document.getElementById("ulubione")} show={ulubioneTooltipVisible} placement="right">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                  <div
                    {...props}
                    style={{
                      backgroundColor: 'rgba(100, 100, 255, 1)',
                      marginLeft: '10px',
                      padding: '5px 10px',
                      color: 'white',
                      borderRadius: 10,
                      ...props.style,
                    }}
                    onMouseEnter={() => setUlubioneTooltipVisible(true)}
                    onMouseLeave={() => setUlubioneTooltipVisible(false)}
                  >
                    {ulubioneSkladniki.map((skladnik, index) => (
                      <div key={index}>{skladnik}</div>
                    ))}
                  </div>
                )}
              </Overlay>
              <div
                className="d-flex text-left"
                onMouseEnter={() => setNieUlubioneTooltipVisible(true)}
                onMouseLeave={() => setNieUlubioneTooltipVisible(false)}
              >
                <div className="ms-3 d-flex" id="nieulubione">
                  <Form.Check
                    type="switch"
                    label={`Moje znienawidzone składniki`}
                    onChange={(event) => setNieUlubioneChecked(event.target.checked)}
                    checked={nieUlubioneChecked}
                  />
                </div>
              </div>
              <Overlay target={document.getElementById("nieulubione")} show={nieUlubioneTooltipVisible} placement="right">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                  <div
                    {...props}
                    style={{
                      backgroundColor: 'rgba(255, 100, 100, 1)',
                      marginLeft: '10px',
                      padding: '5px 10px',
                      color: 'white',
                      borderRadius: 10,
                      ...props.style,
                    }}
                    onMouseEnter={() => setNieUlubioneTooltipVisible(true)}
                    onMouseLeave={() => setNieUlubioneTooltipVisible(false)}
                  >
                    {nieUlubioneSkladniki.map((skladnik, index) => (
                      <div key={index}>{skladnik}</div>
                    ))}
                  </div>
                )}
              </Overlay>
              <div className="ms-3 mt-3 d-flex flex-wrap">
                <label style={{ fontWeight: "bold" }}>Nazwa:</label>
                <Form.Control
                  className="col-6"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tu wpisz id/nazwę/składniki/cenę w dowolnej kolejności"
                  style={{ padding: "5px", marginRight: "25px", marginTop: "5px", background: "white", color: "black" }}
                />
              </div>
              <div className="ms-3 mt-3 d-flex flex-wrap">
                <label style={{ fontWeight: "bold" }}>Sortuj według:</label>
                <Form.Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "5px", marginRight: "25px", marginTop: "5px", background: "#555", color: "white" }}
                >
                  <option value="">-- Wybierz --</option>
                  <option value="IDAsc">ID rosnąco</option>
                  <option value="IDDesc">ID malejąco</option>
                  <option value="priceAsc">Cena rosnąco</option>
                  <option value="priceDesc">Cena malejąco</option>
                  <option value="nameAsc">Nazwa A-Z</option>
                  <option value="nameDesc">Nazwa Z-A</option>
                </Form.Select>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
};

export default PizzaFilter;