import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jgyrkytxpdrozrfygpvl.supabase.co",
  "sb_publishable_MgpctTKQmVsqEodIggy_zw_G23nF_Pb",
);

const SearchLineTemplate = document.querySelector("[search-device-temp]");
const SearchLineContainer = document.querySelector("[search-line-container]");
const InputSearch = document.querySelector("[device-search]");

const progressBar = document.querySelector(".progress_bar");
const options = document.querySelectorAll(".posluga_wrapper");
const body = document.body;

const pageSize = 1000;

let devices = [];

const fetchDevices = async () => {
  let all = [];
  let from = 0;
  let to = pageSize - 1;

  while (true) {
    const { error, data } = await supabase
      .from("Devices")
      .select("*, Type (*, Department (*)), Brand (*)")
      .range(from, to);

    if (error) {
      console.log("Error of data extraction:" + error.message);
      break;
    }

    all = all.concat(data);

    if (data.length < pageSize) break;

    from += pageSize;
    to += pageSize;
  }

  devices = all.map((device) => {
    const line = SearchLineTemplate.content.cloneNode(true).children[0];

    const image = line.querySelector("[line-device-image]");
    const model = line.querySelector("[line-device-model]");
    const department = line.querySelector("[line-device-department]");
    const price = line.querySelector("[line-device-price]");
    const articule = line.querySelector("[line-device-articule]");

    model.textContent = device.model;
    price.textContent = device.price;
    department.textContent = "Відділ: " + device.Type.Department.department;
    articule.textContent = "Артикул: " + device.id;
    image.src = `https://jgyrkytxpdrozrfygpvl.supabase.co/storage/v1/object/public/device_images/${device.image}`;

    SearchLineContainer.append(line);
    return {
      model: device.model,
      articule: device.id,
      department: device.Type.Department.department,
      element: line,
    };
  });
};

function updateProgress() {
  const progressText = document.querySelector("#progress_text");

  progressBar.classList.remove("stage_1", "stage_2", "stage_3", "stage_4");
  progressBar.classList.add("stage_1");
  progressText.textContent = "1/4 для продовження, оберіть тип послуги";

  if (false) {
    //stage 4?

    return;
  } else if (false) {
    //stage 3?

    return;
  } else if (
    body.classList.contains("remont") ||
    body.classList.contains("obmin")
  ) {
    progressBar.classList.remove("stage_1", "stage_2", "stage_3", "stage_4");
    progressBar.classList.add("stage_2");
    progressText.textContent = "2/4 для продовження, оберіть тип послуги";

    return;
  }
}

InputSearch.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  devices.forEach((device) => {
    const isVisible =
      device.model.toLowerCase().includes(value) ||
      device.articule.toString().toLowerCase() == value.toLowerCase() ||
      device.department.toLowerCase().includes(value);

    device.element.classList.toggle("hide", !isVisible);
  });
});

fetchDevices();

const device_form = document.querySelector(".device_info_form");
const side_form = document.querySelector(".side_form");

SearchLineContainer.addEventListener("pointerup", (e) => {
  const device = e.target.closest(".search_field_element");
  if (!device) {
    console.log("click not found");
    return;
  }

  device_form.querySelector(".device_name").textContent = device.querySelector(
    "[line-device-model]",
  ).textContent;
  device_form.querySelector("[department]").textContent = device.querySelector(
    "[line-device-department]",
  ).textContent;
  device_form.querySelector("[articule]").textContent = device.querySelector(
    "[line-device-articule]",
  ).textContent;
  device_form.querySelector(".price_calc").textContent = device.querySelector(
    "[line-device-price]",
  ).textContent;
  device_form.querySelector(".device_img").src = device.querySelector(
    "[line-device-image]",
  ).src;
  updateProgress();
  side_form.classList.add("active");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    const form = option.nextElementSibling;
    const isOpen = option.classList.contains("active");

    options.forEach((o) => {
      o.classList.remove("active");

      const f = o.nextElementSibling;
      if (f) {
        f.style.height = "0px";
      }
    });

    if (progressBar.classList.contains("stage_1") || progressBar.classList.contains("stage_2")) {
      body.classList.remove("remont", "obmin");

      if (!isOpen) {
        option.classList.add("active");

        const name = option.dataset.name;
        if (name) {
          body.classList.add(name);
        }

        form.style.height = "auto";
        const height = form.scrollHeight;

        form.style.height = "0px";

        requestAnimationFrame(() => {
          form.style.height = height + "px";
        });
      } else {
        form.style.height = "0px";
      }

      updateProgress();
    }
  });
});
