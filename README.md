hye.life
-----------

This is the source code of [hye.life](https://hye.life)

If you use any of this code then you must release it along with your
code since this is licensed as GPL-3.0.

Եթե դուք օգտագործեք այս կոդի որևէ մաս, ապա դուք պետք է այն հրապարակեք
ձեր կոդի հետ միասին, քանի որ այն լիցենզավորված է որպես GPL-3.0.

Если вы используете этот код, то вы должны выпустить его на ряду с
вашим кодом так, как это заверено в лицензии GPL-3.0.

# Developing

To make changes in this code base that will be reflected on the
website, you need to `fork` this project from me on github and then
clone it on your machine. Once you finish making your changes, you
make a `pull request` to me.

# Adding a Facebook group for the events calendar
To add a FB group for the events calendar to automatically show, just
checkout the `backend/groups.json` file, add a `Facebook` group name and its
ID, then open a pull request with the new group added. You can find
the group's ID using something like `http://findmyfbid.com`.

# Adding/Making changes to the slideshow
To make a change to the slide show, like changing a description or
adding a new slide or even just reordering them, look at
`lib/slides.jsx`. Change what is appropriate and open a pull request
with the changes.
