const gallery = document.querySelector('#gallery') as HTMLElement;
const previousButton = document.querySelector('#previous') as HTMLButtonElement;
const nextButton = document.querySelector('#next') as HTMLButtonElement;
const sendingForm = document.querySelector('#sending-form') as HTMLFormElement;
const sendingFormSubmitInput = document.querySelector('#sending-form-submit') as HTMLInputElement;
const queryFilterButton = document.querySelector('#queryFilter') as HTMLInputElement;

const updateQueryParams = (pageNumber: string, limit: string, filter: string) => {
  if (location.search !== `?page=${pageNumber}&limit=${limit}&filter=${filter}`) {
    location.search = `?page=${pageNumber}&limit=${limit}&filter=${filter}`;
  }
};

const queryFilterButtonEvent = async () => {
  const currentState = queryFilterButton.checked;
  setFilter(currentState);
  await showGalleryWrapper()
};

const nextButtonEvent = async () => {
  const currentPage = getCurrentPage();
  const newPage = Number(currentPage) + 1;
  setNewPage(newPage);
  await showGalleryWrapper()
};

const previousButtonEvent = async () => {
  const currentPage = getCurrentPage();
  const newPage = Number(currentPage) - 1;
  setNewPage(newPage);
  await showGalleryWrapper()
};

const sendingFormEvent = async (event: Event) => {
  event.preventDefault();
  const picture = document.querySelector('#picture') as HTMLInputElement;
  if (!picture.files || !picture.files[0]) {
    return alert('Please choose file to upload');
  }

  const formData = new FormData();
  formData.append('picture', picture.files[0]);

  sendingFormSubmitInput.disabled = true;
  try {
    await httpPost<Response>(`${API_URL}/gallery`, formData, {
      authorization: getToken(),
    });
  } catch (error) {
    console.log(error);
  }
  sendingFormSubmitInput.disabled = false;
  alert('Image successfully uploaded');

  await showGalleryWrapper()
};

const checkPageLimitsAndBorders = async (data: Gallery, page: string, filter: string) => {
  if (Number(page) === 1 && filter === 'true' && !data.objects.length) {
    alert(UPLOADED_PICTURES_NOT_FOUND);
    setFilter();
    await showGalleryWrapper()
    return;
  }
  if (!data.objects.length || Number(page) < 1) {
    alert(PAGE_DOES_NOT_EXIST);
    setNewPage();
    await showGalleryWrapper()
    return;
  }
};

const showGallery = async (page: string, token: string, limit: string, filter: string) => {
  updateQueryParams(page, limit, filter);
  queryFilterButton.checked = filter === 'true';

  try {
    const data = await httpGet<Gallery>(`${API_URL}/gallery?page=${page}&limit=${limit}&filter=${filter}`, token);
    await checkPageLimitsAndBorders(data, page, filter);
    gallery.innerHTML = '';
    data.objects.forEach(
      (imgLink) => (gallery.innerHTML += `<img src='${imgLink.path}' width='200' height='200' alt='img'>`),
    );
  } catch (e) {
    console.log(e);
  }
};

const showGalleryWrapper = async () => {
  return async () => await showGallery(getCurrentPage(), getToken(), getLimit(), getFilter());

};

const redirectToIndex = () => {
  removeToken();
  nextButton.removeEventListener(EVENT_TYPES.click, nextButtonEvent);
  previousButton.removeEventListener(EVENT_TYPES.click, previousButtonEvent);
  sendingForm.removeEventListener(EVENT_TYPES.submit, sendingFormEvent);
  queryFilterButton.removeEventListener(EVENT_TYPES.click, queryFilterButtonEvent);
  return document.location.replace('./index.html');
};

removeTokenWithTimeout();

updateLimitIfChange();
updatePageIfChange();
updateFilterIfChange();

showGalleryWrapper()

nextButton.addEventListener(EVENT_TYPES.click, nextButtonEvent);
previousButton.addEventListener(EVENT_TYPES.click, previousButtonEvent);
sendingForm.addEventListener(EVENT_TYPES.submit, sendingFormEvent);
queryFilterButton.addEventListener(EVENT_TYPES.click, queryFilterButtonEvent);
