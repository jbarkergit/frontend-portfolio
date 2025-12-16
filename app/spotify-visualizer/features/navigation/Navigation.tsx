import type { SVGProps } from 'react';

function doSomething() {}

const left = {
  home: { icon: <BiHouse />, func: doSomething },
  discover: { icon: <BiStars />, func: doSomething },
  search: { icon: <BiSearch />, func: doSomething },
} as const;

const right = {
  notification: { icon: <BiBell />, func: doSomething },
  lock: { icons: [<BiUnlock2 />, <BiLockFill />], func: doSomething },
  social: { icon: <BiPersonLinesFill />, func: doSomething },
  settings: { icon: <BiGear />, func: doSomething },
  user: { icon: <MaterialSymbolsLightPersonBook />, func: doSomething },
} as const;

export type NavigationKeys = keyof typeof left;

const Navigation = () => {
  return (
    <nav className='navigation'>
      <div className='navigation__wrapper'>
        <ul className='navigation__wrapper__left'>
          {Object.entries(left).map(([key, { icon, func }]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1');

            return (
              <li key={key}>
                <button className='navigation__wrapper__left__btn' aria-label={formattedKey} onClick={func}>
                  <span>{icon}</span>
                  <span>{formattedKey}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className='navigation__wrapper__center'>SEARCH</div>

        <ul className='navigation__wrapper__right'>
          {Object.entries(right).map(([key, value]) => {
            const icon = 'icons' in value ? value.icons : [value.icon];
            const formattedKey = key.replace(/([A-Z])/g, ' $1');

            return (
              <li key={key}>
                <button className='navigation__wrapper__right__btn' aria-label={formattedKey} onClick={value.func}>
                  <div>
                    {icon.map((i, idx) => (
                      <span key={idx}>{i}</span>
                    ))}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

export function BiHouse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z'
      />
    </svg>
  );
}

export function BiStars(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z'
      />
    </svg>
  );
}

export function BiSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0'
      />
    </svg>
  );
}

export function BiBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742c-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6'
      />
    </svg>
  );
}

export function BiUnlock2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M8 0c1.07 0 2.041.42 2.759 1.104l.14.14l.062.08a.5.5 0 0 1-.71.675l-.076-.066l-.216-.205A3 3 0 0 0 5 4v2h6.5A2.5 2.5 0 0 1 14 8.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7z'
      />
    </svg>
  );
}

export function BiLockFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3'
      />
    </svg>
  );
}

export function BiPersonLinesFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M6 8a3 3 0 1 0 0-6a3 3 0 0 0 0 6m-5 6s-1 0-1-1s1-4 6-4s6 3 6 4s-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z'
      />
    </svg>
  );
}

export function BiGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <g fill='currentColor'>
        <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492a3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0a2.246 2.246 0 0 1-4.492 0' />
        <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z' />
      </g>
    </svg>
  );
}

export function MaterialSymbolsLightPersonBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M12 16.385q-1.725 0-3.234.524q-1.51.525-2.766 1.475v1q0 .25.173.433t.423.183h10.789q.269 0 .442-.173t.173-.443v-1q-1.275-.95-2.775-1.475T12 16.385M6.616 21q-.672 0-1.144-.472T5 19.385V4.615q0-.69.463-1.152T6.616 3h10.769q.69 0 1.153.463T19 4.616v14.769q0 .67-.472 1.143q-.472.472-1.143.472zM12 14.077q1.258 0 2.129-.871T15 11.077t-.871-2.129T12 8.077t-2.129.871T9 11.077t.871 2.129t2.129.871'
      />
    </svg>
  );
}
