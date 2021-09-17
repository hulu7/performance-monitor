new Vue({
    el: '#view-help',
    data() {
        return {
            content: ''
        }
    },
    beforeMount(){
        this.renderHelpDoc();
    },
    mounted(){},
    methods:{
        createDocument(str) {
            const template = `<div class='content'>${str}</div>`;
            const doc = new DOMParser().parseFromString(template, 'text/html');
            const div = doc.querySelector('.content');
            return div;
        },
        renderHelpDoc() {
            return util.ajax({
                url: `${config.baseApi}help-doc`,
                type: 'get',
                success: data => {
                    const container = document.getElementById('view-help');
                    container.appendChild(this.createDocument(data.data || ''));
                }
            })
        }
    }
})